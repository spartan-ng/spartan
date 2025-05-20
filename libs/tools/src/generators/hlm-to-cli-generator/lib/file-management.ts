import { type Tree, generateFiles } from '@nx/devkit';
import * as path from 'node:path';
import type { HlmToCliGeneratorGeneratorSchema } from '../schema';

function deleteSpecFiles(tree: Tree, dir: string) {
	for (const entry of tree.children(dir)) {
		const fullPath = path.join(dir, entry);

		if (tree.isFile(fullPath)) {
			if (fullPath.endsWith('.spec.ts')) {
				tree.delete(fullPath);
			}
		} else {
			deleteSpecFiles(tree, fullPath);
		}
	}
}

export const copyFilesFromHlmLibToGenerator = (
	tree: Tree,
	srcPath: string,
	filesPath: string,
	options: HlmToCliGeneratorGeneratorSchema,
) => {
	generateFiles(tree, srcPath, filesPath, options);
	tree.delete(path.join(filesPath, 'test-setup.ts'));
	deleteSpecFiles(tree, filesPath);
	renameImports(tree, filesPath);
	renameToTemplate(tree, filesPath);
};

export const createSharedGeneratorFiles = (
	tree: Tree,
	projectRoot: string,
	options: HlmToCliGeneratorGeneratorSchema,
	entrypoint: string,
) => {
	generateFiles(tree, path.join(__dirname, '..', 'files'), projectRoot, {
		...options,
		primitiveName: entrypoint.replaceAll('-', ''),
		internalName: `ui-${entrypoint}-helm`,
		publicName: `ui-${entrypoint.replaceAll('-', '')}-helm`,
	});
};

export function renameToTemplate(tree: Tree, filePath: string) {
	const files = recursivelyFindFiles(tree, filePath);

	files.forEach((file) => {
		tree.rename(file, `${file}.template`);
	});
}

function renameImports(tree: Tree, filePath: string) {
	const files = recursivelyFindFiles(tree, filePath);

	for (const file of files) {
		const content = tree.read(file, 'utf-8');

		// we must find any imports matching with an import specifier like with `@spartan-ng/helm/aspect-ratio` and rename it to `@spartan-ng/ui-aspect-ratio-helm`
		const newContent = content.replace(
			/from\s+['"]@spartan-ng\/helm\/([a-zA-Z0-9-]+)['"]/g,
			(_match, component) => `from '@spartan-ng/ui-${component}-helm'`,
		);

		if (content === newContent) {
			continue;
		}

		tree.write(file, newContent);
	}
}

export function recursivelyDelete(tree: Tree, filePath: string) {
	const files = recursivelyFindFiles(tree, filePath);
	files.forEach((file) => tree.delete(file));
}

/**
 * Recursively find all the files in a directory.
 * @param tree The tree object
 * @param dir The directory to search
 * @returns An array of file paths
 */
export function recursivelyFindFiles(tree: Tree, dir: string) {
	const files: string[] = [];

	for (const file of tree.children(dir)) {
		const filePath = path.join(dir, file);

		if (tree.isFile(filePath)) {
			files.push(filePath);
		} else {
			files.push(...recursivelyFindFiles(tree, filePath));
		}
	}
	return files;
}
