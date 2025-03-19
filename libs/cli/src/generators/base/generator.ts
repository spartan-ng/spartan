import {
	type GeneratorCallback,
	type Tree,
	addDependenciesToPackageJson,
	generateFiles,
	joinPathFragments,
	runTasksInSerial,
} from '@nx/devkit';
import { addTsConfigPath } from '@nx/js';
import { getRootTsConfigPathInTree, readTsConfigPaths } from '@nx/js/src/utils/typescript/ts-config';
import { readdirSync } from 'node:fs';
import * as path from 'node:path';
import { getInstalledPackageVersion } from '../../utils/version-utils';
import { buildDependencyArray, buildDevDependencyArray } from './lib/build-dependency-array';
import { getTargetLibraryDirectory } from './lib/get-target-library-directory';
import { initializeAngularLibrary } from './lib/initialize-angular-library';
import type { HlmBaseGeneratorSchema } from './schema';
import { FALLBACK_ANGULAR_VERSION } from './versions';

export async function hlmBaseGenerator(tree: Tree, options: HlmBaseGeneratorSchema) {
	const tasks: GeneratorCallback[] = [];
	const targetLibDir = getTargetLibraryDirectory(options, tree);

	const existingPathsByAlias = readTsConfigPaths(getRootTsConfigPathInTree(tree)) ?? {};
	const tsConfigAliasToUse = `@spartan-ng/${options.publicName}`;

	if (Object.keys(existingPathsByAlias).includes(tsConfigAliasToUse) && !options.update) {
		console.log(`Skipping ${tsConfigAliasToUse}. It's already installed!`);
		return runTasksInSerial(...tasks);
	}

	// if we are updating, we delete the src directory to remove files that were removed, otherwise add to tsconfig
	if (options.update) {
		deleteDirectory(tree, joinPathFragments(targetLibDir, 'src'));
	} else {
		if (options.angularCli) {
			addTsConfigPath(tree, tsConfigAliasToUse, [`.${path.sep}${joinPathFragments(targetLibDir, 'src', 'index.ts')}`]);
		} else {
			tasks.push(await initializeAngularLibrary(tree, options));
		}
	}

	generateFiles(
		tree,
		path.join(__dirname, '..', 'ui', 'libs', options.internalName, 'files'),
		path.join(targetLibDir, 'src'),
		options,
	);

	const angularVersion = getInstalledPackageVersion(tree, '@angular/core', FALLBACK_ANGULAR_VERSION, true);
	const existingCdkVersion = getInstalledPackageVersion(tree, '@angular/cdk', FALLBACK_ANGULAR_VERSION, true);
	const dependencies = buildDependencyArray(options, angularVersion, existingCdkVersion);
	const devDependencies = buildDevDependencyArray();

	tasks.push(addDependenciesToPackageJson(tree, dependencies, devDependencies));
	return runTasksInSerial(...tasks);
}

export default hlmBaseGenerator;

function deleteDirectory(tree: Tree, dirPath: string) {
	if (!tree.exists(dirPath)) {
		return;
	}
	const files = readdirSync(tree.root + '/' + dirPath);

	for (const file of files) {
		const filePath = joinPathFragments(dirPath, file);
		if (tree.isFile(filePath)) {
			tree.delete(filePath);
		} else {
			deleteDirectory(tree, filePath); // Recursively delete subdirectories
		}
	}
	tree.delete(dirPath); // Delete the empty directory itself.
}
