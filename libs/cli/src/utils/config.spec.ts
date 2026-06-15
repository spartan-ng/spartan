import { type Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getImportAlias } from './config';

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
