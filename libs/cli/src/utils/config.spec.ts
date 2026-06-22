import { readJson, type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { backfillStyleInComponentsJson, getImportAlias, loadOrInitConfig } from './config';

describe('getImportAlias', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('returns the default alias when no config exists', async () => {
		await expect(getImportAlias(tree, false)).resolves.toBe('@spartan-ng/helm');
	});

	it('returns the configured alias from a valid config', async () => {
		writeJson(tree, 'components.json', { importAlias: '@my-org/ui' });

		await expect(getImportAlias(tree, false)).resolves.toBe('@my-org/ui');
	});

	// A present-but-invalid config must fail loudly rather than silently fall back to the default
	// alias, which would run every migration against the wrong imports.
	it('throws when the config exists but is invalid', async () => {
		writeJson(tree, 'components.json', { importAlias: 123 });

		await expect(getImportAlias(tree, false)).rejects.toThrow();
	});
});

describe('loadOrInitConfig', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('applies the default style in memory and leaves the file untouched', async () => {
		writeJson(tree, 'components.json', { importAlias: '@spartan-ng/helm' });

		const config = await loadOrInitConfig(tree, { angularCli: false });

		expect(config.style).toBe('vega');
		expect(readJson(tree, 'components.json').style).toBeUndefined();
	});
});

describe('backfillStyleInComponentsJson', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('writes the fallback style when components.json omits it', async () => {
		writeJson(tree, 'components.json', { importAlias: '@spartan-ng/helm' });

		await backfillStyleInComponentsJson(tree);

		expect(readJson(tree, 'components.json').style).toBe('vega');
	});

	it('is a no-op when there is no config', async () => {
		await backfillStyleInComponentsJson(tree);

		expect(tree.exists('components.json')).toBe(false);
	});
});
