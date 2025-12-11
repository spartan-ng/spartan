import { type Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { hlmCliNxGeneratorGenerator } from './generator';
import type { HlmToCliGeneratorGeneratorSchema } from './schema';

describe('hlm-to-nx-generator generator', () => {
	let tree: Tree;
	const options: HlmToCliGeneratorGeneratorSchema = {};

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await hlmCliNxGeneratorGenerator(tree, options);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
