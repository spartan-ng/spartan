import { readJson, type Tree } from '@nx/devkit';

import type { PackageJson } from 'nx/src/utils/package-json';
import * as semver from 'semver';

export const getTailwindVersion = (tree: Tree): number => {
	const packageJson = readJson<PackageJson>(tree, 'package.json');
	const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

	let tailwindVersion = 3;

	if ('tailwindcss' in deps) {
		const version = deps['tailwindcss'];
		tailwindVersion = semver.coerce(version)?.major ?? 3;
	}

	return tailwindVersion;
};
