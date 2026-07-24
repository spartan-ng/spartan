import { logger, type Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { prompt } from 'enquirer';
import { updateLibraryMetadata } from './detect-customizations';
import { migrateHelmLibrariesGenerator } from './generator';

// patch the interactive prompt so warning and confirmation flows can be tested deterministically
vi.mock('enquirer', () => ({
	prompt: vi.fn(),
}));

describe('migrate-helm-libraries generator', () => {
	let tree: Tree;

	afterEach(() => {
		vi.restoreAllMocks();
	});

	beforeEach(() => {
		vi.clearAllMocks();
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

	it('reports customized files before asking which libraries to migrate', async () => {
		tree.write(
			'tsconfig.base.json',
			JSON.stringify({
				compilerOptions: {
					paths: {
						'@spartan-ng/helm/button': ['libs/ui/button/src/index.ts'],
						'@spartan-ng/helm/card': ['libs/ui/card/src/index.ts'],
					},
				},
			}),
		);
		tree.write('libs/ui/button/src/index.ts', 'export const button = true;');
		tree.write('libs/ui/card/src/index.ts', 'export const card = true;');
		updateLibraryMetadata(tree, 'button', 'libs/ui/button', '1.1.1');
		updateLibraryMetadata(tree, 'card', 'libs/ui/card', '1.1.1');
		tree.write('libs/ui/button/src/lib/custom.ts', 'export const custom = true;');

		vi.mocked(prompt).mockResolvedValue({ libraries: [] });
		const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => undefined);
		const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);

		await migrateHelmLibrariesGenerator(tree, {
			generateAs: 'library',
			buildable: true,
			importAlias: '@spartan-ng/helm',
			style: 'vega',
		});

		expect(infoSpy).toHaveBeenCalledWith('   ✓ 1 unchanged libraries (safe to migrate)');
		expect(infoSpy).toHaveBeenCalledWith('   ⚠ 1 customized libraries (contain modifications)');
		expect(warnSpy).toHaveBeenCalledWith('   📦 button:');
		expect(warnSpy).toHaveBeenCalledWith('      - Added: src/lib/custom.ts');
		expect(infoSpy).toHaveBeenCalledWith('No libraries will be updated.');
	});

	it('requires explicit confirmation before overwriting a customized library', async () => {
		tree.write(
			'tsconfig.base.json',
			JSON.stringify({
				compilerOptions: { paths: { '@spartan-ng/helm/button': ['libs/ui/button/src/index.ts'] } },
			}),
		);
		tree.write('libs/ui/button/src/index.ts', 'export const button = true;');
		updateLibraryMetadata(tree, 'button', 'libs/ui/button', '1.1.1');
		tree.write('libs/ui/button/src/index.ts', 'export const customizedButton = true;');

		vi.mocked(prompt)
			.mockResolvedValueOnce({ libraries: ['button'] })
			.mockResolvedValueOnce({ confirm: false });
		const infoSpy = vi.spyOn(logger, 'info').mockImplementation(() => undefined);
		const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);

		await migrateHelmLibrariesGenerator(tree, {
			generateAs: 'library',
			buildable: true,
			importAlias: '@spartan-ng/helm',
			style: 'vega',
		});

		expect(warnSpy).toHaveBeenCalledWith('\n⚠️  WARNING: The following customized libraries will be overwritten:');
		expect(infoSpy).toHaveBeenCalledWith('Aborting migration.');
		expect(tree.read('libs/ui/button/src/index.ts', 'utf-8')).toBe('export const customizedButton = true;');
	});
});
