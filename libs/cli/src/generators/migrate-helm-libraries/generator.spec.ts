import { logger, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateHelmLibrariesGenerator } from './generator';

// patch some imports to avoid running the actual code
jest.mock('enquirer');

describe('migrate-helm-libraries generator', () => {
	let tree: Tree;

	afterEach(() => {
		jest.restoreAllMocks();
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
			}),
		);
	});

	// Regression test for the `@nx/workspace` barrel import.
	// Importing `removeGenerator` from the `@nx/workspace` entry point eagerly evaluates the
	// barrel, which loads `convert-to-nx-project` -> `output.js`. On nx 22 that module crashes
	// with "Cannot read properties of undefined (reading 'inverse')", so the generator threw
	// before doing any work. Loading the generator and running it must not throw.
	it('should run without crashing on the @nx/workspace barrel import', async () => {
		const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => undefined);

		await expect(
			migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: true,
				importAlias: '@spartan-ng/helm',
			}),
		).resolves.toBeUndefined();

		expect(infoSpy).toHaveBeenCalledWith('No libraries to migrate');
	});
});
