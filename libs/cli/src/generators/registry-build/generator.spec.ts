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
});
