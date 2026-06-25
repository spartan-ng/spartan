import { type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import registryBuildGenerator from './generator';

describe('registry-build generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('builds first-party registry JSON from bundled templates', async () => {
		await registryBuildGenerator(tree, { output: 'public/r' });

		expect(tree.exists('public/r/button.json')).toBe(true);
		expect(tree.read('public/r/button.json', 'utf-8')).toContain('<%- importAlias %>');
		expect(tree.exists('public/r/registry.json')).toBe(true);
	});

	it('removes stale registry JSON before writing the current registry', async () => {
		tree.write('public/r/stale.json', JSON.stringify({ name: 'stale' }));
		tree.write('public/r/nested/stale.json', JSON.stringify({ name: 'nested-stale' }));
		tree.write('public/r/README.md', 'keep me');

		await registryBuildGenerator(tree, { output: 'public/r' });

		expect(tree.exists('public/r/stale.json')).toBe(false);
		expect(tree.exists('public/r/nested/stale.json')).toBe(false);
		expect(tree.exists('public/r/README.md')).toBe(true);
		expect(tree.exists('public/r/button.json')).toBe(true);
		expect(tree.exists('public/r/registry.json')).toBe(true);
	});
});
