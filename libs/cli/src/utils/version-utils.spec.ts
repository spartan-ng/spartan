import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getInstalledPackageVersion } from './version-utils';

describe('getInstalledPackageVersion', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		writeJson(tree, 'package.json', {
			dependencies: { '@spartan-ng/brain': '0.0.1-alpha.300' },
			devDependencies: { '@spartan-ng/cli': '^1.2.3' },
		});
	});

	it('returns the cleaned installed version', () => {
		expect(getInstalledPackageVersion(tree, '@spartan-ng/cli')).toBe('1.2.3');
	});

	it('returns the raw range when raw=true', () => {
		expect(getInstalledPackageVersion(tree, '@spartan-ng/cli', undefined, true)).toBe('^1.2.3');
	});

	it('returns null when the package is not installed and no default is given', () => {
		expect(getInstalledPackageVersion(tree, '@spartan-ng/missing')).toBeNull();
	});

	it('falls back to the default version when the package is not installed', () => {
		expect(getInstalledPackageVersion(tree, '@spartan-ng/missing', '2.0.0')).toBe('2.0.0');
	});

	it('uses the default when the installed version is a "latest" tag', () => {
		writeJson(tree, 'package.json', { dependencies: { '@spartan-ng/brain': 'latest' } });

		expect(getInstalledPackageVersion(tree, '@spartan-ng/brain', '3.1.0')).toBe('3.1.0');
	});

	// Regression for the coerce(...).version NPE: an uncleanable, uncoercible version string must
	// resolve to null instead of throwing on a null coerce() result.
	it('returns null (without throwing) for an uncoercible version string', () => {
		writeJson(tree, 'package.json', { dependencies: { '@spartan-ng/brain': 'garbage' } });

		expect(() => getInstalledPackageVersion(tree, '@spartan-ng/brain')).not.toThrow();
		expect(getInstalledPackageVersion(tree, '@spartan-ng/brain')).toBeNull();
	});
});
