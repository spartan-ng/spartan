import { type Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { replaceUiVersionGenerator } from './generator';
import type { ReplaceUiVersionGeneratorSchema } from './schema';

describe('replace-cli-version generator', () => {
	let tree: Tree;
	const options: ReplaceUiVersionGeneratorSchema = {};

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await replaceUiVersionGenerator(tree, options);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
