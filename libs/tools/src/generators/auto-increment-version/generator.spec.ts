import { type Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import autoIncrementVersion from './generator';

describe('replace-cli-version generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await autoIncrementVersion(tree);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
