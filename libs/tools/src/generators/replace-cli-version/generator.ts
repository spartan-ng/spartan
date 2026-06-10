import { formatFiles, type Tree, updateJson } from '@nx/devkit';
import process from 'node:process';

export default async function replaceCliVersionGenerator(tree: Tree, options?: { newVersion?: string }): Promise<void> {
	const packageJsonPath = 'libs/cli/package.json';
	const newVersion = options?.newVersion ?? process.env.VERSION;

	if (!newVersion) {
		throw new Error(
			'replace-cli-version: no version provided. Pass --version=<version> or set the VERSION environment variable.',
		);
	}

	updateJson(tree, packageJsonPath, (pkgJson) => {
		pkgJson.version = newVersion;
		return pkgJson;
	});

	await formatFiles(tree);

	console.log(`updated CLI version to ${newVersion}`);
}
