import {
	type GeneratorCallback,
	type Tree,
	addDependenciesToPackageJson,
	generateFiles,
	joinPathFragments,
	runTasksInSerial,
	updateJson,
} from '@nx/devkit';
import { addTsConfigPath } from '@nx/js';
import * as path from 'node:path';

import { readTsConfigPathsFromTree } from '../../utils/tsconfig';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray, buildDevDependencyArray } from './lib/build-dependency-array';
import { deleteFiles } from './lib/deleteFiles';
import { getTargetLibraryDirectory } from './lib/get-target-library-directory';
import { initializeAngularLibrary } from './lib/initialize-angular-library';

import type { HlmBaseGeneratorSchema } from './schema';
import { FALLBACK_ANGULAR_VERSION } from './versions';

function isAlreadyInstalled(tree: Tree, alias: string): boolean {
	const existingPaths = readTsConfigPathsFromTree(tree);
	return alias in existingPaths;
}

function setupTsConfigAlias(tree: Tree, alias: string, targetLibDir: string) {
	addTsConfigPath(tree, alias, [`./${joinPathFragments(targetLibDir, 'src', 'index.ts').replace(/\\/g, '/')}`]);
}

function generateSingleLibFiles(tree: Tree, targetLibDir: string, alias: string, options: HlmBaseGeneratorSchema) {
	// Generate files from template
	generateFiles(tree, path.join(__dirname, '..', 'ui', 'libs', options.internalName, 'files'), targetLibDir, options);

	// Rename lib/ to src/
	const libDir = joinPathFragments(targetLibDir, 'lib');
	if (tree.exists(libDir)) {
		tree.rename(libDir, joinPathFragments(targetLibDir, 'src'));
	}

	// Replace './lib' with './src' in index.ts
	const indexPath = joinPathFragments(targetLibDir, 'index.ts');
	if (tree.exists(indexPath)) {
		const content = tree.read(indexPath, 'utf-8');
		tree.write(indexPath, content.replace(/\.\/lib/g, './src'));
	}

	// Add TS alias to tsconfig.base.json
	updateJson(tree, 'tsconfig.base.json', (json) => {
		json.compilerOptions ||= {};
		json.compilerOptions.paths ||= {};
		json.compilerOptions.paths[alias] = [`./${joinPathFragments(targetLibDir, 'index.ts').replace(/\\/g, '/')}`];
		return json;
	});
}

function generateMultiLibFiles(tree: Tree, targetLibDir: string, options: HlmBaseGeneratorSchema) {
	const deletePath = joinPathFragments(options.directory, options.publicName, 'src', 'lib', options.publicName);
	deleteFiles(tree, deletePath);

	generateFiles(
		tree,
		path.join(__dirname, '..', 'ui', 'libs', options.internalName, 'files'),
		joinPathFragments(targetLibDir, 'src'),
		options,
	);
}

function registerDependencies(tree: Tree, options: HlmBaseGeneratorSchema): GeneratorCallback {
	const angularVersion = getInstalledPackageVersion(tree, '@angular/core', FALLBACK_ANGULAR_VERSION, true);
	const cdkVersion = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_VERSION, true);
	const dependencies = buildDependencyArray(options, angularVersion, cdkVersion);
	const devDependencies = buildDevDependencyArray();
	return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
	const tasks: GeneratorCallback[] = [];
	const targetLibDir = getTargetLibraryDirectory(options, tree);
	const tsConfigAlias = `@spartan-ng/helm/${options.primitiveName}`;

	if (isAlreadyInstalled(tree, tsConfigAlias)) {
		console.log(`Skipping ${tsConfigAlias}. It's already installed!`);
		return runTasksInSerial(...tasks);
	}

	if (options.angularCli) {
		setupTsConfigAlias(tree, tsConfigAlias, targetLibDir);
	} else if (options.multiLibs) {
		tasks.push(await initializeAngularLibrary(tree, options));
	}

	if (options.multiLibs) {
		generateMultiLibFiles(tree, targetLibDir, options);
	} else {
		generateSingleLibFiles(tree, targetLibDir, tsConfigAlias, options);
	}

	tasks.push(registerDependencies(tree, options));

	return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
