import { type Tree, updateJson } from '@nx/devkit';
import process from 'node:process';
import type { ReplaceCliVersionGeneratorSchema } from './schema';

export default async function replaceCliVersionGenerator(tree: Tree, options: ReplaceCliVersionGeneratorSchema) {
	const packageJsonPath = 'libs/cli/package.json';
	const newVersion = process.env.CLI_VERSION;

	if (!newVersion) {
		console.error('Must define a CLI_VERSION environment variable to use with this script.');
		return;
	}

	updateJson(tree, packageJsonPath, (pkgJson) => {
		pkgJson.version = newVersion;
		return pkgJson;
	});

	console.log(`updated CLI version to ${newVersion}`);
}
