import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Schema } from '@nx/angular/src/generators/library/schema';
import {
	addDependenciesToPackageJson,
	joinPathFragments,
	readJson,
	type Tree,
	updateJson,
	writeJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { dedupeEntrypointGlobs, hlmBaseGenerator } from './generator';
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

// Stub @angular/core down to its VERSION so the generator's Angular-version check is deterministic.
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
		// Load the real generator for just this test; the file-level vi.mock stubs libraryGenerator.
		// vi.importActual is test-scoped, unlike vi.unmock which is hoisted to the whole file.
		const { libraryGenerator } =
			await vi.importActual<typeof import('@nx/angular/generators')>('@nx/angular/generators');

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

	it('adds the components dir to tsconfig.app.json include for angular-cli projects', async () => {
		// Simulate an Angular CLI app layout: a root tsconfig.app.json that only includes `src`. The generated
		// libs live under libs/test-ui (outside src), so without this they'd be orphaned in the editor.
		writeJson(tree, 'tsconfig.app.json', { extends: './tsconfig.json', include: ['src/**/*.ts'] });

		await hlmBaseGenerator(tree, {
			name: 'button',
			directory: 'libs/test-ui',
			buildable: false,
			generateAs: 'library' as const,
			importAlias: '@spartan-ng/helm',
			angularCli: true,
		});

		const tsconfigApp = readJson(tree, 'tsconfig.app.json');
		expect(tsconfigApp.include).toContain('libs/test-ui/**/*.ts');
		// the app's own src glob is preserved
		expect(tsconfigApp.include).toContain('src/**/*.ts');
	});

	it('does not duplicate the components include across multiple angular-cli generations', async () => {
		writeJson(tree, 'tsconfig.app.json', { include: ['src/**/*.ts'] });
		const base = {
			directory: 'libs/test-ui',
			buildable: false,
			generateAs: 'library' as const,
			importAlias: '@spartan-ng/helm',
			angularCli: true,
		};

		await hlmBaseGenerator(tree, { ...base, name: 'button' });
		await hlmBaseGenerator(tree, { ...base, name: 'card' });

		const tsconfigApp = readJson(tree, 'tsconfig.app.json');
		const globCount = tsconfigApp.include.filter((glob: string) => glob === 'libs/test-ui/**/*.ts').length;
		expect(globCount).toBe(1);
	});

	it('leaves the workspace untouched when there is no tsconfig.app.json', async () => {
		await hlmBaseGenerator(tree, {
			name: 'button',
			directory: 'libs/test-ui',
			buildable: false,
			generateAs: 'library' as const,
			importAlias: '@spartan-ng/helm',
			angularCli: true,
		});

		expect(tree.exists('tsconfig.app.json')).toBe(false);
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

	it('should not exponentially grow tsconfig.lib.json include/exclude across many buildable entrypoints', async () => {
		// Regression test: nx's `librarySecondaryEntryPointGenerator` re-prefixes every existing
		// include/exclude glob for each entrypoint, doubling the arrays each time. With enough
		// primitives (e.g. `migrate-helm-libraries` -> "all") the JSON serialization eventually
		// throws `RangeError: Invalid string length`. The generator must keep these arrays bounded.
		const { libraryGenerator } =
			await vi.importActual<typeof import('@nx/angular/generators')>('@nx/angular/generators');

		const directory = 'libs/test-ui';
		const importAlias = '@spartan-ng/helm';

		await libraryGenerator(tree, {
			buildable: true,
			name: singleLibName,
			importPath: importAlias,
			directory,
			skipTests: true,
			unitTestRunner: UnitTestRunner.None,
		});

		// Seed include/exclude explicitly rather than relying on nx's library defaults: a recursive
		// `**/*.ts` include (what `initializeAngularEntrypoint` adds) plus the standard spec/test excludes.
		// This keeps the assertions about the normalized result independent of nx's default tsconfig.
		updateJson(tree, joinPathFragments(directory, 'tsconfig.lib.json'), (json) => {
			json.include = ['src/**/*.ts', '**/*.ts'];
			json.exclude = ['src/**/*.spec.ts', 'src/**/*.test.ts'];
			return json;
		});

		// 30+ primitives reproduces the failure: the doubling crosses the string-length ceiling.
		const primitives = [
			'accordion',
			'alert',
			'avatar',
			'badge',
			'button',
			'card',
			'checkbox',
			'collapsible',
			'command',
			'dialog',
			'icon',
			'input',
			'kbd',
			'label',
			'menubar',
			'pagination',
			'popover',
			'progress',
			'scroll-area',
			'select',
			'separator',
			'sheet',
			'skeleton',
			'slider',
			'sonner',
			'spinner',
			'switch',
			'table',
			'tabs',
			'textarea',
			'toggle',
			'tooltip',
		];

		for (const name of primitives) {
			await hlmBaseGenerator(tree, {
				name,
				directory,
				buildable: true,
				generateAs: 'entrypoint' as const,
				importAlias,
			});
		}

		const tsconfig = readJson(tree, joinPathFragments(directory, 'tsconfig.lib.json'));
		// A correct result is a small, constant-sized set of globs - never one entry per primitive.
		expect(tsconfig.include.length).toBeLessThan(10);
		expect(tsconfig.exclude.length).toBeLessThan(10);
		// The recursive include still covers every entrypoint's sources...
		expect(tsconfig.include).toContain('**/*.ts');
		// ...and the recursive excludes still keep every entrypoint's specs/tests out of the build.
		expect(tsconfig.exclude).toContain('**/*.spec.ts');
		expect(tsconfig.exclude).toContain('**/*.test.ts');
	});
});

describe('dedupeEntrypointGlobs', () => {
	it('collapses entrypoint-prefixed variants to a single recursive glob', () => {
		const include = ['src/**/*.ts', '**/*.ts', 'accordion/src/**/*.ts', 'accordion/**/*.ts', 'alert/**/*.ts'];
		expect(dedupeEntrypointGlobs(include, ['**/*.ts'])).toEqual(['**/*.ts']);
	});

	it('only restores a recursive glob when a variant was present (no unconditional injection)', () => {
		// exclude with no spec/test globs at all: must stay as-is, not gain `**/*.spec.ts`/`**/*.test.ts`.
		expect(dedupeEntrypointGlobs(['jest.config.ts'], ['**/*.spec.ts', '**/*.test.ts'])).toEqual(['jest.config.ts']);
		// only spec variants present -> only the spec recursive glob is restored, test is not injected.
		expect(dedupeEntrypointGlobs(['src/**/*.spec.ts', 'jest.config.ts'], ['**/*.spec.ts', '**/*.test.ts'])).toEqual([
			'jest.config.ts',
			'**/*.spec.ts',
		]);
	});

	it('does not rewrite flat custom globs (only recursive `/**/` sub-paths are collapsed)', () => {
		// `*.ts` matches only the root and `tools/*.ts` only that folder; neither is an nx entrypoint
		// variant (no `/**/`), so both are preserved rather than widened to `**/*.ts`.
		expect(dedupeEntrypointGlobs(['*.ts'], ['**/*.ts'])).toEqual(['*.ts']);
		expect(dedupeEntrypointGlobs(['tools/*.ts', 'accordion/src/**/*.ts'], ['**/*.ts'])).toEqual([
			'tools/*.ts',
			'**/*.ts',
		]);
	});
});
