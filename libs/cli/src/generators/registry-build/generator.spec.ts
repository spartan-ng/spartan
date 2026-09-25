import { readJson, type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { STYLES } from '../../utils/supported-styles';
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

		const item = readJson(tree, 'public/r/button.json');
		for (const style of STYLES) {
			expect(item.styleMaps[style]['spartan-button']).toBeTruthy();
		}
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

	it('preserves custom registry style metadata', async () => {
		tree.write('src/button.ts', 'export const button = true;');
		writeJson(tree, 'registry.json', {
			name: 'acme',
			homepage: 'https://acme.test',
			items: [
				{
					name: 'button',
					type: 'registry:ui',
					files: [{ path: 'src/button.ts', target: 'button.ts', type: 'registry:ui' }],
					cssVars: { light: { background: 'oklch(1 0 0)' } },
					css: { '.acme-button': { color: 'red' } },
					tailwind: { config: { theme: { extend: { colors: { acme: 'red' } } } } },
					styleMaps: { nova: { 'spartan-button': 'inline-flex' } },
				},
			],
		});

		await registryBuildGenerator(tree, { registry: 'registry.json', output: 'public/r' });

		const item = readJson(tree, 'public/r/button.json');
		expect(item.files[0].content).toBe('export const button = true;');
		expect(item.cssVars.light.background).toBe('oklch(1 0 0)');
		expect(item.css['.acme-button'].color).toBe('red');
		expect(item.tailwind.config.theme.extend.colors.acme).toBe('red');
		expect(item.styleMaps.nova['spartan-button']).toBe('inline-flex');
	});
});
