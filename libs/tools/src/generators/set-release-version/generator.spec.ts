import { readJson, type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import setReleaseVersionGenerator from './generator';

const LOCKSTEP_PACKAGE_JSONS = ['libs/brain/package.json', 'libs/cli/package.json', 'libs/mcp/package.json'];
const CHARTS_PACKAGE_JSON = 'libs/charts/package.json';

describe('set-release-version', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		for (const path of [...LOCKSTEP_PACKAGE_JSONS, CHARTS_PACKAGE_JSON]) {
			writeJson(tree, path, { name: path, version: '1.0.0-alpha.1' });
		}
		delete process.env.VERSION;
	});

	it('stamps newVersion into the lockstep package.jsons', async () => {
		await setReleaseVersionGenerator(tree, { newVersion: '1.2.3' });

		for (const path of LOCKSTEP_PACKAGE_JSONS) {
			expect(readJson(tree, path).version).toBe('1.2.3');
		}
	});

	it('bumps charts on its own alpha line instead of taking newVersion', async () => {
		await setReleaseVersionGenerator(tree, { newVersion: '1.2.3' });

		expect(readJson(tree, CHARTS_PACKAGE_JSON).version).toBe('1.0.0-alpha.2');
	});

	it('falls back to the VERSION env var when newVersion is omitted', async () => {
		process.env.VERSION = '4.5.6';

		await setReleaseVersionGenerator(tree);

		for (const path of LOCKSTEP_PACKAGE_JSONS) {
			expect(readJson(tree, path).version).toBe('4.5.6');
		}
		expect(readJson(tree, CHARTS_PACKAGE_JSON).version).toBe('1.0.0-alpha.2');
	});

	it('throws when no version is provided', async () => {
		await expect(setReleaseVersionGenerator(tree)).rejects.toThrow(/no version provided/);
	});

	it('only changes the version field, leaving the rest of package.json intact', async () => {
		writeJson(tree, 'libs/brain/package.json', {
			name: '@spartan-ng/brain',
			version: '0.0.1-alpha.1',
			peerDependencies: { '@angular/core': '>=21.0.0' },
		});

		await setReleaseVersionGenerator(tree, { newVersion: '1.2.3' });

		const pkg = readJson(tree, 'libs/brain/package.json');
		expect(pkg.version).toBe('1.2.3');
		expect(pkg.name).toBe('@spartan-ng/brain');
		expect(pkg.peerDependencies).toEqual({ '@angular/core': '>=21.0.0' });
	});
});
