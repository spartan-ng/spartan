import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { registryItemSchema } from '../schema/schema';
import { buildUrlAndHeadersForRegistryItem } from './config';
import { parseRegistryAndItemFromString } from './parser';
import { resolveRegistryItemList, resolveRegistryItems } from './resolver';

describe('registry utilities', () => {
	it('parses namespaced registry item addresses', () => {
		expect(parseRegistryAndItemFromString('@acme/button')).toEqual({ registry: '@acme', item: 'button' });
		expect(parseRegistryAndItemFromString('button')).toEqual({ registry: null, item: 'button' });
	});

	it('builds URLs and headers from registry config', () => {
		const result = buildUrlAndHeadersForRegistryItem('@acme/button', {
			style: 'vega',
			registries: {
				'@acme': {
					url: 'https://example.com/{style}/{name}.json',
					headers: { Authorization: 'Bearer token' },
				},
			},
		});

		expect(result?.url).toBe('https://example.com/vega/button.json');
		expect(result?.headers).toEqual({ Authorization: 'Bearer token' });
	});

	it('resolves registry dependencies before dependents', async () => {
		const items = await resolveRegistryItemList(
			['card'],
			{},
			{
				builtinItemFactory: async (name) => ({
					name,
					type: 'registry:ui',
					registryDependencies: name === 'card' ? ['utils'] : [],
					files: [{ path: `${name}.ts`, target: `${name}.ts`, type: 'registry:ui', content: name }],
				}),
			},
		);

		expect(items.map((item) => item.name)).toEqual(['utils', 'card']);
	});

	it('loads local registry item JSON', async () => {
		const dir = await fs.mkdtemp(path.join(tmpdir(), 'spartan-registry-'));
		const file = path.join(dir, 'item.json');
		await fs.writeFile(
			file,
			JSON.stringify({
				name: 'local',
				type: 'registry:ui',
				files: [{ path: 'index.ts', target: 'index.ts', type: 'registry:ui', content: 'export {};' }],
			}),
		);

		const tree = await resolveRegistryItems([file]);

		expect(tree.files?.[0]?.target).toBe('index.ts');
	});

	it('validates style maps', () => {
		expect(
			registryItemSchema.safeParse({
				name: 'button',
				type: 'registry:ui',
				styleMaps: {
					nova: {
						'spartan-button': 'inline-flex',
					},
				},
			}).success,
		).toBe(true);

		expect(
			registryItemSchema.safeParse({
				name: 'button',
				type: 'registry:ui',
				styleMaps: {
					nova: {
						button: 'inline-flex',
					},
				},
			}).success,
		).toBe(false);
	});

	it('merges style maps across registry dependencies with dependents winning', async () => {
		const tree = await resolveRegistryItems(
			['button'],
			{},
			{
				builtinItemFactory: async (name) => ({
					name,
					type: 'registry:ui',
					registryDependencies: name === 'button' ? ['utils'] : [],
					styleMaps: {
						nova: {
							'spartan-shared': name === 'button' ? 'button-value' : 'utils-value',
							[`spartan-${name}`]: name,
						},
					},
				}),
			},
		);

		expect(tree.styleMaps?.nova).toEqual({
			'spartan-utils': 'utils',
			'spartan-button': 'button',
			'spartan-shared': 'button-value',
		});
	});
});
