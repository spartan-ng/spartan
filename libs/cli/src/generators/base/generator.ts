import {
	addDependenciesToPackageJson,
	generateFiles,
	type GeneratorCallback,
	joinPathFragments,
	runTasksInSerial,
	type Tree,
	updateJson,
	visitNotIgnoredFiles,
} from '@nx/devkit';
import { addTsConfigPath, getRootTsConfigPathInTree } from '@nx/js';
import * as path from 'node:path';

import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray, buildDevDependencyArray } from './lib/build-dependency-array';
import { deleteFiles } from './lib/deleteFiles';
import { getTargetLibraryDirectory } from './lib/get-target-library-directory';
import { initializeAngularLibrary } from './lib/initialize-angular-library';

import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { promises as fsPromises } from 'fs';
import { singleLibName } from './lib/single-lib-name';
import { createStyleMap } from './lib/styles/create-style-map';
import { transformStyle } from './lib/styles/transform';
import type { HlmBaseGeneratorSchema } from './schema';
import { FALLBACK_ANGULAR_CDK_VERSION } from './versions';

const styleMapCache = new Map<string, Record<string, string>>();

async function getStyleMap(style: string) {
	if (styleMapCache.has(style)) {
		return styleMapCache.get(style)!;
	}
	try {
		const cssPath = path.join(__dirname, '..', 'ui', `style-${style}.css`);
		const css = await fsPromises.readFile(cssPath, 'utf-8');
		const styleMap = createStyleMap(css);
		styleMapCache.set(style, styleMap);
		return styleMap;
	} catch {
		return {};
	}
}

function isAlreadyInstalled(tree: Tree, alias: string): boolean {
	const existingPaths = readTsConfigPathsFromTree(tree);
	return alias in existingPaths;
}

function setupAngularCliProject(tree: Tree, alias: string, targetLibDir: string) {
	addTsConfigPath(tree, alias, [`./${joinPathFragments(targetLibDir, 'src', 'index.ts').replace(/\\/g, '/')}`]);
}

// nx's `librarySecondaryEntryPointGenerator` appends an entrypoint-prefixed copy of every existing
// include/exclude glob each time it runs (see `updateTsConfigIncludedFiles`). When many entrypoints
// are generated into the same library - e.g. `migrate-helm-libraries` (or `ui`) with "all" selected -
// these arrays double on every call until `JSON.stringify` throws `RangeError: Invalid string length`.
//
// The library already includes a recursive `**/*.ts` glob, which matches files in every entrypoint
// subdirectory, so the prefixed copies are redundant. This collapses them back to a bounded, equivalent
// set of recursive globs. It is idempotent, so it stays bounded no matter how many entrypoints are added.
function dedupeEntrypointGlobs(patterns: string[], recursiveGlobs: string[]): string[] {
	// The suffix each recursive glob already covers, e.g. '**/*.ts' -> '*.ts', '**/*.spec.ts' -> '*.spec.ts'.
	const suffixes = recursiveGlobs.map((glob) => glob.replace(/^\*\*\//, ''));
	// A glob is redundant if a recursive sibling already matches the same files in every subdirectory.
	const isCoveredByRecursiveGlob = (pattern: string) =>
		pattern.includes('*') && suffixes.some((suffix) => pattern === suffix || pattern.endsWith(`/${suffix}`));

	const result = patterns.filter((pattern) => !isCoveredByRecursiveGlob(pattern));
	for (const glob of recursiveGlobs) {
		if (!result.includes(glob)) {
			result.push(glob);
		}
	}
	return result;
}

function normalizeEntrypointTsConfig(tree: Tree, libraryDir: string): void {
	const tsConfigLibPath = joinPathFragments(libraryDir, 'tsconfig.lib.json');
	if (!tree.exists(tsConfigLibPath)) {
		return;
	}
	updateJson(tree, tsConfigLibPath, (json) => {
		if (Array.isArray(json.include)) {
			json.include = dedupeEntrypointGlobs(json.include, ['**/*.ts']);
		}
		if (Array.isArray(json.exclude)) {
			json.exclude = dedupeEntrypointGlobs(json.exclude, ['**/*.spec.ts', '**/*.test.ts']);
		}
		return json;
	});
}

async function generateEntrypointFiles(tree: Tree, alias: string, options: HlmBaseGeneratorSchema): Promise<string> {
	const targetLibDir = `${options.directory}/${options.name}/src`;

	if (options.buildable) {
		await librarySecondaryEntryPointGenerator(tree, {
			name: options.name,
			library: singleLibName,
			skipFormat: true,
			skipModule: true,
		});
		// Collapse the redundant entrypoint-prefixed globs nx just appended so the include/exclude
		// arrays stay bounded as more entrypoints are added. See `dedupeEntrypointGlobs`.
		normalizeEntrypointTsConfig(tree, options.directory);
	} else {
		// Resolve the workspace's root tsconfig rather than assuming tsconfig.base.json - a standalone nx
		// workspace registers paths in tsconfig.json (there is no base file).
		updateJson(tree, getRootTsConfigPathInTree(tree), (json) => {
			json.compilerOptions ||= {};
			json.compilerOptions.paths ||= {};
			json.compilerOptions.paths[alias] = [`./${joinPathFragments(targetLibDir, 'index.ts').replace(/\\/g, '/')}`];
			return json;
		});
	}
	generateFiles(tree, path.join(__dirname, '..', 'ui', 'libs', options.name, 'files'), targetLibDir, options);
	return targetLibDir;
}

function generateLibraryFiles(tree: Tree, targetLibDir: string, options: HlmBaseGeneratorSchema) {
	const deletePath = joinPathFragments(options.directory, options.name, 'src', 'lib', options.name);
	deleteFiles(tree, deletePath);

	generateFiles(
		tree,
		path.join(__dirname, '..', 'ui', 'libs', options.name, 'files'),
		joinPathFragments(targetLibDir, 'src'),
		options,
	);
}

function registerDependencies(tree: Tree, options: HlmBaseGeneratorSchema): GeneratorCallback {
	const cdkVersion = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_CDK_VERSION, true);
	const dependencies = buildDependencyArray(tree, options, cdkVersion);
	const devDependencies = buildDevDependencyArray();
	return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
	const tasks: GeneratorCallback[] = [];
	const targetLibDir = getTargetLibraryDirectory(options, tree);
	const tsConfigAlias = `${options.importAlias}/${options.name}`;

	if (isAlreadyInstalled(tree, tsConfigAlias)) {
		console.log(`Skipping ${tsConfigAlias}. It's already installed!`);
		return runTasksInSerial(...tasks);
	}

	if (options.angularCli) {
		setupAngularCliProject(tree, tsConfigAlias, targetLibDir);
	} else if (options.generateAs === 'library') {
		tasks.push(await initializeAngularLibrary(tree, options));
	}
	let filesPath = targetLibDir;

	if (options.generateAs === 'entrypoint') {
		filesPath = await generateEntrypointFiles(tree, tsConfigAlias, options);
	} else {
		generateLibraryFiles(tree, targetLibDir, options);
	}

	// TODO: add style to component.json
	const styleMap = await getStyleMap('vega');
	const generatedFiles: string[] = [];

	visitNotIgnoredFiles(tree, filesPath, (filePath) => {
		generatedFiles.push(filePath);
	});

	for (const filePath of generatedFiles) {
		const content = tree.read(filePath, 'utf-8');
		if (!content) continue;
		const transformed = await transformStyle(content, { styleMap });
		tree.write(filePath, transformed);
	}

	tasks.push(registerDependencies(tree, options));

	return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
