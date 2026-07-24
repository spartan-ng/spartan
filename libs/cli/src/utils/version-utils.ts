import { readJson, type Tree } from '@nx/devkit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { clean, coerce } from 'semver';

// The version of the running @spartan-ng/cli package. brain releases in lockstep with the cli, so when the
// target workspace doesn't pin the cli we request the brain that matches *this* generator. __dirname is
// <pkg>/src/utils in both source and dist, so ../../package.json is the cli package root.
export function getCliPackageVersion(): string {
	const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf-8'));
	const version = coerce(pkg.version)?.version;
	if (!version) throw new Error('Unable to determine @spartan-ng/cli version from its package.json');
	return version;
}

export function getInstalledPackageVersion(
	tree: Tree,
	packageName: string,
	defaultVersion?: string,
	raw = false,
): string | null {
	const pkgJson = readJson(tree, 'package.json');
	const installedPackageVersion = pkgJson.dependencies?.[packageName] || pkgJson.devDependencies?.[packageName];
	if (!installedPackageVersion && !defaultVersion) {
		return null;
	}

	if (!installedPackageVersion || installedPackageVersion === 'latest' || installedPackageVersion === 'next') {
		return clean(defaultVersion) ?? coerce(defaultVersion)?.version ?? null;
	}

	return (
		(raw ? installedPackageVersion : clean(installedPackageVersion)) ?? coerce(installedPackageVersion)?.version ?? null
	);
}
