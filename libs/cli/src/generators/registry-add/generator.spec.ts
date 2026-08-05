import { readJson, type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import registryAddGenerator from './generator';

vi.mock('enquirer');

describe('registry-add generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
		writeJson(tree, 'components.json', { componentsPath: 'libs/ui' });
	});

	it('adds registry config entries', async () => {
		await registryAddGenerator(tree, { registries: '@acme=https://example.com/r/{name}.json' });

		expect(readJson(tree, 'components.json').registries).toEqual({
			'@acme': 'https://example.com/r/{name}.json',
		});
	});

	it('rejects overriding the built-in spartan registry', async () => {
		await expect(
			registryAddGenerator(tree, { registries: '@spartan=https://example.com/{name}.json' }),
		).rejects.toThrow('built-in registry');
	});
});
