import { readJson } from '@nx/devkit';
import type { PackageJson } from 'nx/src/utils/package-json';
import * as semver from 'semver';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

export const versionHealthcheck: Healthcheck = {
	name: 'Spartan - Dependency Check',
	async detect(tree, failure, skip) {
		// If there is no package.json, skip this healthcheck
		if (!tree.exists('package.json')) {
			skip('No package.json found.');
			return;
		}

		// read the package.json
		const packageJson = readJson(tree, 'package.json');

		// merge the dependencies and devDependencies
		const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

		const dependenciesToCheck = ['@spartan-ng/brain', '@spartan-ng/cli'];

		for (const dep of dependenciesToCheck) {
			if (!dependencies[dep]) {
				failure(`The dependency ${dep} is not installed.`, HealthcheckSeverity.Error, true);
				continue;
			}

			const installedVersion = dependencies[dep];

			// check if the installed version is the latest version
			const metadata = await fetchLatestMetadata(dep);

			if (!metadata) {
				failure(`Failed to fetch metadata for ${dep}.`, HealthcheckSeverity.Error, false);
				continue;
			}

			if (!semver.satisfies(metadata.version, installedVersion)) {
				failure(
					`The installed version of ${dep} is not the latest version. The latest version is ${metadata.version}.`,
					HealthcheckSeverity.Warning,
					true,
				);
				continue;
			}
		}
	},
	fix: async (tree) => {
		const packageJson = readJson(tree, 'package.json');
		const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
		const dependenciesToCheck = ['@spartan-ng/brain', '@spartan-ng/cli'];

		for (const dep of dependenciesToCheck) {
			if (!dependencies[dep]) {
				return false;
			}

			const metadata = await fetchLatestMetadata(dep);

			if (!metadata) {
				return false;
			}

			// update the dependency to the latest version in the respective section
			if (packageJson.dependencies[dep]) {
				packageJson.dependencies[dep] = `^${metadata.version}`;
			} else {
				packageJson.devDependencies[dep] = `^${metadata.version}`;
			}
		}

		tree.write('package.json', JSON.stringify(packageJson, null, 2));

		return true;
	},
	prompt: 'Would you like to update to the latest versions of the dependencies?',
};

async function fetchLatestMetadata(dep: string): Promise<PackageJson | null> {
	try {
		const request = await fetch(`https://registry.npmjs.org/${dep}/latest`);

		if (!request.ok) {
			return null;
		}

		return (await request.json()) as PackageJson;
	} catch {
		// offline, DNS failure, timeout, malformed JSON - treat as "could not determine latest"
		return null;
	}
}
