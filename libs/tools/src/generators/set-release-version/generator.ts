import { formatFiles, type Tree, updateJson } from '@nx/devkit';
import process from 'node:process';
import { inc } from 'semver';

// semantic-release computes one stable version; brain/cli/mcp ship in lockstep off it.
const LOCKSTEP_PACKAGE_JSONS = ['libs/brain/package.json', 'libs/cli/package.json', 'libs/mcp/package.json'];

// charts is still experimental: it rides the same release run but carries its own independent alpha
// line, bumping the prerelease counter (1.0.0-alpha.N -> 1.0.0-alpha.N+1) rather than taking the
// stable version, and publishes under the `alpha` dist-tag (see the `release-charts` npm script).
// When charts graduates, move it back into LOCKSTEP_PACKAGE_JSONS and drop this special case.
const CHARTS_PACKAGE_JSON = 'libs/charts/package.json';

export default async function setReleaseVersionGenerator(tree: Tree, options?: { newVersion?: string }): Promise<void> {
	const newVersion = options?.newVersion ?? process.env.VERSION;

	if (!newVersion) {
		throw new Error(
			'set-release-version: no version provided. Pass --newVersion=<version> (or --new-version=<version>) or set the VERSION environment variable.',
		);
	}

	for (const packageJsonPath of LOCKSTEP_PACKAGE_JSONS) {
		updateJson(tree, packageJsonPath, (pkgJson) => {
			pkgJson.version = newVersion;
			return pkgJson;
		});
	}

	let chartsVersion = '';
	updateJson(tree, CHARTS_PACKAGE_JSON, (pkgJson) => {
		const next = inc(pkgJson.version, 'prerelease', 'alpha');
		if (!next) {
			throw new Error(`set-release-version: could not bump charts prerelease from "${pkgJson.version}".`);
		}
		chartsVersion = next;
		pkgJson.version = next;
		return pkgJson;
	});

	await formatFiles(tree);

	console.log(`Set brain, cli and mcp version to ${newVersion}; charts to ${chartsVersion}`);
}
