import { type Tree, formatFiles, readJsonFile, updateJson } from '@nx/devkit';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import type { ReplaceUiVersionGeneratorSchema } from './schema';

async function recursivelyFindRelativePackageJsonFilePaths(startingDir: string): Promise<string[]> {
	let results = [];
	const list = await readdir(startingDir);
	for (const file of list) {
		const filePath = join(startingDir, file);
		const fileStat = await stat(filePath);
		if (fileStat.isDirectory()) {
			results = results.concat(await recursivelyFindRelativePackageJsonFilePaths(filePath));
		} else if (file === 'package.json') {
			results.push(filePath);
		}
	}
	return results;
}

const getSpartanDependencyKeys = (dependencies?: Record<string, string>): string[] =>
	Object.keys(dependencies ?? {}).filter((key) => key.startsWith('@spartan-ng'));

const replaceUiVersionInCliVersionsFile = (tree: Tree, oldVersion: string, newVersion: string) => {
	const filePath = `libs/cli/src/generators/base/versions.ts`;
	let contents = tree.read(filePath).toString();
	contents = contents.replaceAll(oldVersion, newVersion);
	tree.write(filePath, contents);
};

export default async function replaceUiVersionGenerator(tree: Tree, options: ReplaceUiVersionGeneratorSchema) {
	const relativePackageJsonFilePaths = await recursivelyFindRelativePackageJsonFilePaths('libs/ui');

	// this goes into the accordion's package.json, which should always be defined
	// if there is no version there we should definitely not move forward
	const oldVersion = readJsonFile(relativePackageJsonFilePaths[0]).version;
	const newVersion = process.env.UI_VERSION;

	if (!oldVersion) {
		console.error(
			"Unable to find old version in our accordion's package.json, which we use as source of truth because its good enough.",
		);
		return;
	}

	if (!newVersion) {
		console.error('Must define a UI_VERSION environment variable to use with this script.');
		return;
	}

	console.log(`Updating UI libs version from ${oldVersion} to ${newVersion}`);

	for (const packageJsonPath of relativePackageJsonFilePaths) {
		updateJson(tree, packageJsonPath, (pkgJson) => {
			const peerDependencyKeysToUpdate = getSpartanDependencyKeys(pkgJson.peerDependencies);

			pkgJson.version = newVersion;

			for (const key of peerDependencyKeysToUpdate) {
				pkgJson.peerDependencies[key] = newVersion;
			}

			return pkgJson;
		});
	}

	console.log(`Reflecting those changes in versions.ts file of the CLI`);
	replaceUiVersionInCliVersionsFile(tree, oldVersion, newVersion);

	await formatFiles(tree);
}
