import { formatFiles, type Tree, updateJson } from '@nx/devkit';
import process from 'node:process';

export default async function replaceMcpVersionGenerator(tree: Tree, options?: { newVersion?: string }): Promise<void> {
	const packageJsonPath = 'libs/mcp/package.json';
	const newVersion = options?.newVersion ?? process.env.VERSION;

	if (!newVersion) {
		throw new Error(
			'replace-mcp-version: no version provided. Pass --version=<version> or set the VERSION environment variable.',
		);
	}

	updateJson(tree, packageJsonPath, (pkgJson) => {
		pkgJson.version = newVersion;
		return pkgJson;
	});

	await formatFiles(tree);

	console.log(`updated MCP version to ${newVersion}`);
}
