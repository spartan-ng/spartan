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

import { librarySecondaryEntryPointGenerator } from '@nx/angular/generators';
import { singleLibName } from './lib/single-lib-name';
import type { HlmBaseGeneratorSchema } from './schema';
import { FALLBACK_ANGULAR_VERSION } from './versions';

function isAlreadyInstalled(tree: Tree, alias: string): boolean {
	const existingPaths = readTsConfigPathsFromTree(tree);
	return alias in existingPaths;
}

function setupTsConfigAlias(tree: Tree, alias: string, targetLibDir: string) {
	addTsConfigPath(tree, alias, [`./${joinPathFragments(targetLibDir, 'src', 'index.ts').replace(/\\/g, '/')}`]);
}

async function generateEntrypointFiles(tree: Tree, alias: string, options: HlmBaseGeneratorSchema) {
	const targetLibDir = `${options.directory}/${options.primitiveName}/src`;

	if (options.buildable) {
		await librarySecondaryEntryPointGenerator(tree, {
			name: options.primitiveName,
			library: singleLibName,
			skipFormat: true,
			skipModule: true,
		});
	} else {
		updateJson(tree, 'tsconfig.base.json', (json) => {
			json.compilerOptions ||= {};
			json.compilerOptions.paths ||= {};
			json.compilerOptions.paths[alias] = [`./${joinPathFragments(targetLibDir, 'index.ts').replace(/\\/g, '/')}`];
			return json;
		});
		generateFiles(tree, path.join(__dirname, '..', 'ui', 'libs', options.internalName, 'files'), targetLibDir, options);
	}
}

function generateLibraryFiles(tree: Tree, targetLibDir: string, options: HlmBaseGeneratorSchema) {
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
	} else if (options.generateAs === 'library') {
		tasks.push(await initializeAngularLibrary(tree, options));
	}

	if (options.generateAs === 'entrypoint') {
		await generateEntrypointFiles(tree, tsConfigAlias, options);
	} else {
		generateLibraryFiles(tree, targetLibDir, options);
	}

	tasks.push(registerDependencies(tree, options));

	return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
