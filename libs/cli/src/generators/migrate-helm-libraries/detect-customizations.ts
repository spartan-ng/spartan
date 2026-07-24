import { joinPathFragments, logger, type Tree } from '@nx/devkit';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { getCliPackageVersion, getInstalledPackageVersion } from '../../utils/version-utils';
import type { Primitive } from '../ui/primitives';

export type LibraryMetadata = {
	version: string;
	hash: string;
	timestamp: number;
	files: Record<string, string>; // filepath -> hash
};

export type SpartanMetadata = {
	libraries: Record<string, LibraryMetadata>;
};

export type LibraryCustomizationDetails = {
	isCustomized: boolean;
	addedFiles: string[];
	modifiedFiles: string[];
	deletedFiles: string[];
};

export type CategorizedLibraries = {
	unchanged: Primitive[];
	customized: Array<{
		primitive: Primitive;
		details: LibraryCustomizationDetails;
	}>;
};

export const METADATA_FILE = '.spartan/library-metadata.json';
const METADATA_GITIGNORE_ENTRY = '.spartan/';

/**
 * Get the metadata file for tracking library versions and hashes
 */
export function getMetadata(tree: Tree): SpartanMetadata {
	if (!tree.exists(METADATA_FILE)) {
		return { libraries: {} };
	}

	try {
		const content = tree.read(METADATA_FILE, 'utf-8');
		const metadata: unknown = JSON.parse(content);
		if (!metadata || typeof metadata !== 'object' || !('libraries' in metadata)) {
			throw new Error('Metadata does not contain a libraries object');
		}
		const libraries = (metadata as { libraries: unknown }).libraries;
		if (!libraries || typeof libraries !== 'object' || Array.isArray(libraries)) {
			throw new Error('Metadata libraries value is invalid');
		}
		return metadata as SpartanMetadata;
	} catch (error) {
		logger.warn(`Failed to read metadata file: ${error}`);
		return { libraries: {} };
	}
}

export function saveMetadata(tree: Tree, metadata: SpartanMetadata): void {
	ensureMetadataIgnored(tree);
	tree.write(METADATA_FILE, `${JSON.stringify(metadata, null, 2)}\n`);
}

function ensureMetadataIgnored(tree: Tree): void {
	const gitignorePath = '.gitignore';
	const gitignore = tree.exists(gitignorePath) ? tree.read(gitignorePath, 'utf-8') : '';
	const alreadyIgnored = gitignore.split(/\r?\n/).some((line) => /^\/?\.spartan\/?$/.test(line.trim()));

	if (!alreadyIgnored) {
		const prefix = gitignore.length > 0 && !gitignore.endsWith('\n') ? '\n' : '';
		tree.write(gitignorePath, `${gitignore}${prefix}${METADATA_GITIGNORE_ENTRY}\n`);
	}
}

function computeHash(content: string): string {
	return createHash('sha256').update(content).digest('hex');
}

/**
 * Normalize content for consistent hashing across different environments
 * Removes formatting differences like whitespace, line endings, etc.
 */
function normalizeContent(content: string): string {
	return (
		content
			.replace(/\r\n/g, '\n') // Normalize CRLF/LF
			.replace(/\r/g, '\n')
			.split('\n')
			.map((line) => line.trimEnd()) // remove trailing whitespace
			.join('\n')
			.trim() + '\n'
	);
}

/**
 * Normalizes content and returns its hash.
 */
function getHashedFileContent(content: string): string {
	const normalizedContent = normalizeContent(content);
	return computeHash(normalizedContent);
}

/**
 * Get all files in a directory recursively
 */
function getFilesRecursively(tree: Tree, directory: string): string[] {
	const files: string[] = [];

	if (!tree.exists(directory)) {
		return files;
	}

	const children = tree.children(directory).sort();

	for (const child of children) {
		const childPath = joinPathFragments(directory, child);

		if (tree.isFile(childPath)) {
			files.push(childPath);
		} else {
			files.push(...getFilesRecursively(tree, childPath));
		}
	}

	return files;
}

function normalizePath(path: string): string {
	return path.replace(/\\/g, '/');
}

/**
 * Get relative path from library root, normalized to forward slashes
 */
function getRelativePath(filePath: string, libraryPath: string): string {
	const normalized = normalizePath(filePath);
	const normalizedLibPath = normalizePath(libraryPath);
	return normalized.replace(normalizedLibPath + '/', '');
}

/**
 * Generate metadata for a library by hashing all its files
 */
export function generateLibraryMetadata(tree: Tree, libraryPath: string, version: string): LibraryMetadata {
	const files: Record<string, string> = {};
	const allFiles = getFilesRecursively(tree, libraryPath);

	for (const filePath of allFiles) {
		// Skip metadata files and build artifacts
		if (filePath.includes('node_modules') || filePath.includes('.spartan')) {
			continue;
		}

		const content = tree.read(filePath, 'utf-8');
		if (typeof content === 'string') {
			const relativePath = getRelativePath(filePath, libraryPath);
			files[relativePath] = getHashedFileContent(content);
		}
	}

	const overallHash = computeHash(JSON.stringify(files));

	return {
		version,
		hash: overallHash,
		timestamp: Date.now(),
		files,
	};
}

/**
 * Check if a library has been customized by comparing the current library hash with the metadata hash
 */
export function isLibraryCustomized(tree: Tree, libraryPath: string, primitive: string): boolean {
	const metadata = getMetadata(tree);
	const libraryMetadata = metadata.libraries[primitive];

	if (!libraryMetadata) {
		// No metadata exists, assume it might be customized or was added manually
		return true;
	}

	const currentMetadata = generateLibraryMetadata(tree, libraryPath, libraryMetadata.version);
	return currentMetadata.hash !== libraryMetadata.hash;
}

export function getCustomizationDetails(
	tree: Tree,
	libraryPath: string,
	primitive: string,
): LibraryCustomizationDetails {
	const metadata = getMetadata(tree);
	const libraryMetadata = metadata.libraries[primitive];

	// if a project doesn't have metadata yet (e.g., it's an old project), assume it's customized.
	if (!libraryMetadata) {
		return {
			isCustomized: true,
			addedFiles: [],
			modifiedFiles: [],
			deletedFiles: [],
		};
	}

	const currentFiles = getFilesRecursively(tree, libraryPath);
	const currentFileHashes: Record<string, string> = {};

	for (const filePath of currentFiles) {
		if (filePath.includes('node_modules') || filePath.includes('.spartan')) {
			continue;
		}

		const content = tree.read(filePath, 'utf-8');
		if (typeof content === 'string') {
			const relativePath = getRelativePath(filePath, libraryPath);
			currentFileHashes[relativePath] = getHashedFileContent(content);
		}
	}

	const addedFiles: string[] = [];
	const modifiedFiles: string[] = [];
	const deletedFiles: string[] = [];

	// Check for added and modified files
	for (const [filePath, hash] of Object.entries(currentFileHashes)) {
		if (!libraryMetadata.files[filePath]) {
			addedFiles.push(filePath);
		} else if (libraryMetadata.files[filePath] !== hash) {
			modifiedFiles.push(filePath);
		}
	}

	// Check for deleted files
	for (const filePath of Object.keys(libraryMetadata.files)) {
		if (!currentFileHashes[filePath]) {
			deletedFiles.push(filePath);
		}
	}

	return {
		isCustomized: addedFiles.length > 0 || modifiedFiles.length > 0 || deletedFiles.length > 0,
		addedFiles,
		modifiedFiles,
		deletedFiles,
	};
}

/**
 * Update metadata for a single primitive (reads and writes metadata file per primitive)
 */
export function updateLibraryMetadata(tree: Tree, primitive: string, libraryPath: string, version: string): void {
	const metadata = getMetadata(tree);
	metadata.libraries[primitive] = generateLibraryMetadata(tree, libraryPath, version);
	saveMetadata(tree, metadata);
}

/**
 * Extracts information about the state of all libraries.
 * Unchanged: libraries that have not been modified.
 * Customized: libraries that have been -- added, modified, or deleted files.
 * @param tree
 * @param libraries
 * @param getLibraryPath
 * @returns CategorizedLibraries
 */
export function categorizeLibraries(
	tree: Tree,
	libraries: Primitive[],
	getLibraryPath: (primitive: Primitive) => string,
): CategorizedLibraries {
	const unchanged: Primitive[] = [];
	const customized: Array<{
		primitive: Primitive;
		details: LibraryCustomizationDetails;
	}> = [];

	for (const primitive of libraries) {
		const libraryPath = getLibraryPath(primitive);
		const details = getCustomizationDetails(tree, libraryPath, primitive);

		if (details.isCustomized) {
			customized.push({ primitive, details });
		} else {
			unchanged.push(primitive);
		}
	}

	return { unchanged, customized };
}

/** Resolve the generated library root for all supported legacy and current aliases. */
export function getLibraryPathFromPrimitive(tree: Tree, primitive: Primitive, importAlias: string): string {
	const tsconfigPaths = readTsConfigPathsFromTree(tree);
	const compatLibrary = primitive.replaceAll('-', '');
	const importPath = [
		`${importAlias}/${primitive}`,
		`@spartan-ng/helm/${primitive}`,
		`@spartan-ng/ui-${primitive}-helm`,
		`@spartan-ng/ui-${compatLibrary}-helm`,
	].find((candidate) => candidate in tsconfigPaths);
	const path = importPath ? tsconfigPaths[importPath]?.[0] : undefined;

	if (!path) {
		throw new Error(`Could not find tsconfig path for library ${primitive}`);
	}

	return normalizePath(dirname(normalizePath(path))).replace(/\/src$/, '');
}

/** Return the installed CLI version, falling back to the version running the generator. */
export function getCurrentCliVersion(tree: Tree): string {
	return getInstalledPackageVersion(tree, '@spartan-ng/cli') ?? getCliPackageVersion();
}

/**
 * Regenerate metadata for all libraries.
 *
 * Reads and writes metadata file once.
 */
export function regenerateAllMetadata(
	tree: Tree,
	libraries: Primitive[],
	getLibraryPath: (primitive: Primitive) => string,
	version: string,
): void {
	const metadata = getMetadata(tree);

	for (const primitive of libraries) {
		try {
			const libraryPath = getLibraryPath(primitive);
			if (tree.exists(libraryPath)) {
				metadata.libraries[primitive] = generateLibraryMetadata(tree, libraryPath, version);
			}
		} catch (error) {
			logger.warn(`Failed to regenerate metadata for ${primitive}: ${error}`);
		}
	}

	saveMetadata(tree, metadata);
	logger.info(`\n✓ Updated customization metadata for ${libraries.length} libraries`);
}
