import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { Schema } from '@nx/angular/src/generators/library/schema';
import { joinPathFragments, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { hlmBaseGenerator } from './generator';

// patch some imports to avoid running the actual code
jest.mock('enquirer');
jest.mock('@nx/devkit', () => {
	const original = jest.requireActual('@nx/devkit');
	return {
		...original,
		ensurePackage: (pkg: string) => jest.requireActual(pkg),
		createProjectGraphAsync: jest.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

// Mock @nx/angular/generators to prevent actual @nx/angular:library generator
// from running and causing dynamic import errors, and to simulate file creation
// for the deleteFiles test.
jest.mock('@nx/angular/generators', () => {
	const original = jest.requireActual('@nx/angular/generators');
	return {
		...original,
		libraryGenerator: jest.fn().mockImplementation(async (tree: Tree, schema: Schema) => {
			// This path is what hlmBaseGenerator expects to be created by the library generator
			// and subsequently deletes.
			// Example: libs/test-ui/ui-button-helm/src/lib/ui-button-helm/
			const dirToCreateAndThenDelete = joinPathFragments(
				schema.directory as string, // schema.directory is asserted by the test to be present
				'src',
				'lib',
				schema.name,
			);
			tree.write(joinPathFragments(dirToCreateAndThenDelete, `dummy.ts`), '// Dummy file created by mock');
		}),
	};
});

describe('base generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();

		await applicationGenerator(tree, {
			name: 'app',
			directory: 'app',
			skipFormat: true,
			e2eTestRunner: E2eTestRunner.None,
			unitTestRunner: UnitTestRunner.None,
			skipPackageJson: true,
			skipTests: true,
		});
	});

	it('should delete the default library files under the <publicName>/src/lib/<publicName> directory', async () => {
		const options = {
			primitiveName: 'button',
			internalName: 'ui-button-helm',
			publicName: 'ui-button-helm',
			directory: 'libs/test-ui',
			buildable: true,
		};

		await hlmBaseGenerator(tree, options);

		// This is the path that hlmBaseGenerator attempts to delete.
		// It corresponds to <options.directory>/<options.publicName>/src/lib/<options.publicName>
		const deletedPath = joinPathFragments(options.directory, options.publicName, 'src', 'lib', options.publicName);

		expect(tree.exists(deletedPath)).toBe(false);
	});
});
