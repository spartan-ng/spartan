import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Schema } from '@nx/angular/src/generators/library/schema';
import { addDependenciesToPackageJson, joinPathFragments, readJson, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { hlmBaseGenerator } from './generator';
import { singleLibName } from './lib/single-lib-name';

// Mock buildDependencyArray and buildDevDependencyArray
vi.mock('./lib/build-dependency-array', () => ({
	buildDependencyArray: vi.fn().mockReturnValue({ '@angular/core': '^17.0.0' }),
	buildDevDependencyArray: vi.fn().mockReturnValue({ '@types/node': '^20.0.0' }),
}));

// Mock devkit and angular/generators
vi.mock('enquirer');
vi.mock('@nx/devkit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@nx/devkit')>();
	return {
		...original,
		ensurePackage: (pkg: string) => require(pkg),
		createProjectGraphAsync: vi.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
		addDependenciesToPackageJson: vi.fn(original.addDependenciesToPackageJson),
	};
});
vi.mock('@nx/angular/generators', async (importOriginal) => {
	const original = await importOriginal<typeof import('@nx/angular/generators')>();
	return {
		...original,
		libraryGenerator: vi.fn().mockImplementation(async (tree: Tree, schema: Schema) => {
			const dirToCreateAndThenDelete = joinPathFragments(schema.directory as string, 'src', 'lib', schema.name);
			tree.write(joinPathFragments(dirToCreateAndThenDelete, `dummy.ts`), '// Dummy file created by mock');
		}),
	};
});

// required because @angular/core is esm and jest doesn't handle esm well
vi.mock('@angular/core', () => ({
	VERSION: {
		major: 19,
	},
}));

describe('hlmBaseGenerator', () => {
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

	it('should delete the default library files under the <publicName>/src/lib/<publicName> directory (library)', async () => {
		const options = {
			name: 'button',
			directory: 'libs/test-ui',
			buildable: true,
			generateAs: 'library' as const,
			importAlias: '@spartan-ng/helm',
		};

		await hlmBaseGenerator(tree, options);

		const deletedPath = joinPathFragments(options.directory, options.name, 'src', 'lib', options.name);

		expect(tree.exists(deletedPath)).toBe(false);
	});

	it('should generate files correctly for a secondary entrypoint and buildable false', async () => {
		const options = {
			name: 'input',

			directory: 'libs/test-ui',
			buildable: false,
			generateAs: 'entrypoint' as const,
			importAlias: '@spartan-ng/helm',
		};

		await hlmBaseGenerator(tree, options);

		const baseDir = joinPathFragments(options.directory, options.name);

		const libDir = joinPathFragments(baseDir, 'lib');
		expect(tree.exists(libDir)).toBe(false);
		const tsconfig = readJson(tree, 'tsconfig.base.json');
		expect(tsconfig.compilerOptions.paths).toHaveProperty('@spartan-ng/helm/input');
		expect(tsconfig.compilerOptions.paths['@spartan-ng/helm/input'][0]).toContain('libs/test-ui/input/src/index.ts');
	});

	it('should generate files correctly for a secondary entrypoint and buildable true', async () => {
		vi.unmock('@nx/angular/generators'); // use real generator here
		const { libraryGenerator } = require('@nx/angular/generators');

		const options = {
			name: 'input',

			directory: 'libs/test-ui',
			buildable: true,
			generateAs: 'entrypoint' as const,
			importAlias: '@spartan-ng/helm',
		};

		await libraryGenerator(tree, {
			buildable: true,
			name: singleLibName,
			importPath: '@spartan-ng/helm',
			directory: 'libs/test-ui',
			skipTests: true,
			unitTestRunner: UnitTestRunner.None,
		});

		await hlmBaseGenerator(tree, options);

		const baseDir = joinPathFragments(options.directory, options.name);

		const libDir = joinPathFragments(baseDir, 'lib');
		expect(tree.exists(libDir)).toBe(false);
		const tsconfig = readJson(tree, 'tsconfig.base.json');
		expect(tsconfig.compilerOptions.paths).toHaveProperty('@spartan-ng/helm/input');
		expect(tsconfig.compilerOptions.paths['@spartan-ng/helm/input'][0]).toContain('libs/test-ui/input/src/index.ts');
	});

	it('should register the correct dependencies', async () => {
		const options = {
			name: 'icon',

			directory: 'libs/test-ui',
			buildable: false,
			generateAs: 'entrypoint' as const,
			importAlias: '@spartan-ng/helm',
		};

		await hlmBaseGenerator(tree, options);

		expect(addDependenciesToPackageJson).toHaveBeenCalledWith(
			expect.anything(), // tree
			{ '@angular/core': '^17.0.0' },
			{ '@types/node': '^20.0.0' },
		);
	});

	it('should not duplicate paths in tsconfig.base.json on second run (idempotent)', async () => {
		const options = {
			name: 'badge',

			directory: 'libs/test-ui',
			buildable: false,
			generateAs: 'entrypoint' as const,
			importAlias: '@spartan-ng/helm',
		};

		await hlmBaseGenerator(tree, options);
		const tsconfigAfterFirstRun = readJson(tree, 'tsconfig.base.json');

		await hlmBaseGenerator(tree, options);
		const tsconfigAfterSecondRun = readJson(tree, 'tsconfig.base.json');

		expect(tsconfigAfterSecondRun.compilerOptions.paths).toEqual(tsconfigAfterFirstRun.compilerOptions.paths);
	});
});
