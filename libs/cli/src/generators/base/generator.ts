import {
	addDependenciesToPackageJson,
	generateFiles,
	type GeneratorCallback,
	joinPathFragments,
	runTasksInSerial,
	type Tree,
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
import { FALLBACK_ANGULAR_CDK_VERSION } from './versions';

function isAlreadyInstalled(tree: Tree, alias: string): boolean {
	const existingPaths = readTsConfigPathsFromTree(tree);
	return alias in existingPaths;
}

function setupAngularCliProject(tree: Tree, alias: string, targetLibDir: string) {
	addTsConfigPath(tree, alias, [`./${joinPathFragments(targetLibDir, 'src', 'index.ts').replace(/\\/g, '/')}`]);
}

async function generateEntrypointFiles(tree: Tree, alias: string, options: HlmBaseGeneratorSchema) {
	const targetLibDir = `${options.directory}/${options.name}/src`;

	if (options.buildable) {
		await librarySecondaryEntryPointGenerator(tree, {
			name: options.name,
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
	}
	generateFiles(tree, path.join(__dirname, '..', 'ui', 'libs', options.name, 'files'), targetLibDir, options);
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
	const devDependencies = buildDevDependencyArray(tree);
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

	if (options.generateAs === 'entrypoint') {
		await generateEntrypointFiles(tree, tsConfigAlias, options);
	} else {
		generateLibraryFiles(tree, targetLibDir, options);
	}

	tasks.push(registerDependencies(tree, options));

	return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;
