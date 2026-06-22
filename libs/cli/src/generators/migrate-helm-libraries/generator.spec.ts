import { logger, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateHelmLibrariesGenerator } from './generator';

// patch some imports to avoid running the actual code
vi.mock('enquirer');

describe('migrate-helm-libraries generator', () => {
	let tree: Tree;

	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();

		// provide a valid config so the generator does not prompt
		tree.write(
			'components.json',
			JSON.stringify({
				componentsPath: 'libs/ui',
				importAlias: '@spartan-ng/helm',
				generateAs: 'library',
				buildable: true,
				style: 'vega',
			}),
		);
	});

	// Regression test for resolving `@nx/workspace`'s `removeGenerator`. The package entry crashes on
	// load ("Cannot read properties of undefined (reading 'inverse')") and the deep `src/` specifier is
	// blocked by `exports` on nx 23+, so the generator must neither import it eagerly nor throw on load.
	// Loading the generator and running it (here: nothing to migrate) must not throw. Resolving the
	// generator itself when a library is removed is covered end-to-end by the cli-smoke suite.
	it('should load and run without eagerly resolving the @nx/workspace remove generator', async () => {
		const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => undefined);

		await expect(
			migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: true,
				importAlias: '@spartan-ng/helm',
				style: 'vega',
			}),
		).resolves.toBeUndefined();

		expect(infoSpy).toHaveBeenCalledWith('No libraries to migrate');
	});
});
