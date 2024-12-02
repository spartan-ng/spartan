import { type Tree, formatFiles, updateJson } from '@nx/devkit';
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

export default async function replaceUiVersionGenerator(tree: Tree, options: ReplaceUiVersionGeneratorSchema) {
	const relativePackageJsonFilePaths = await recursivelyFindRelativePackageJsonFilePaths('libs/ui');

	const newVersion = process.env.UI_VERSION;

	if (!newVersion) {
		console.error('Must define a VERSION environment variable to use with this script');
		return;
	}

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

	await formatFiles(tree);
}
