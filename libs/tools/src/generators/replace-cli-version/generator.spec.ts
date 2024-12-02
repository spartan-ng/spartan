import { type Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { replaceCliVersionGenerator } from './generator';
import type { ReplaceCliVersionGeneratorSchema } from './schema';

describe('replace-cli-version generator', () => {
	let tree: Tree;
	const options: ReplaceCliVersionGeneratorSchema = {};

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await replaceCliVersionGenerator(tree, options);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
