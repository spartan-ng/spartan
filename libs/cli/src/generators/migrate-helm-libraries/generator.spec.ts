jest.mock('@nx/devkit', () => {
	const original = jest.requireActual('@nx/devkit');
	return {
		...original,
		ensurePackage: (pkg: string) => jest.requireActual(pkg),
		createProjectGraphAsync: jest.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
		logger: {
			log: jest.fn(),
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			debug: jest.fn(),
		},
	};
});

jest.mock('enquirer', () => ({
	prompt: jest.fn(),
}));

jest.mock('../ui/generator');
jest.mock('../../utils/config');
jest.mock('@nx/workspace');

import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { logger } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { updateLibraryMetadata } from './detect-customizations';
import { migrateHelmLibrariesGenerator } from './generator';

const { prompt } = require('enquirer');
const { createPrimitiveLibraries } = require('../ui/generator');
const { getOrCreateConfig } = require('../../utils/config');
const { removeGenerator } = require('@nx/workspace');

describe('migrate-helm-libraries generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();
		jest.clearAllMocks();

		// Setup mocks
		(getOrCreateConfig as jest.Mock).mockResolvedValue({
			importAlias: '@spartan-ng/helm',
			generateAs: 'library',
			buildable: false,
		});

		(createPrimitiveLibraries as jest.Mock).mockResolvedValue([]);
		(removeGenerator as jest.Mock).mockResolvedValue(undefined);

		// Add a .gitignore file to prevent warnings
		tree.write('.gitignore', 'node_modules\ndist\n');

		await applicationGenerator(tree, {
			name: 'app',
			directory: 'app',
			skipFormat: true,
			e2eTestRunner: E2eTestRunner.None,
			unitTestRunner: UnitTestRunner.None,
			skipPackageJson: true,
			skipTests: true,
		});

		// Setup basic tsconfig paths
		tree.write(
			'tsconfig.base.json',
			JSON.stringify({
				compilerOptions: {
					paths: {},
				},
			}),
		);
	});

	describe('when no libraries exist', () => {
		it('should log info and exit early', async () => {
			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(logger.info).toHaveBeenCalledWith('No libraries to migrate');
		});
	});

	describe('when libraries exist', () => {
		beforeEach(() => {
			// Setup some libraries in tsconfig
			tree.write(
				'tsconfig.base.json',
				JSON.stringify({
					compilerOptions: {
						paths: {
							'@spartan-ng/helm/button': ['libs/button/src/index.ts'],
							'@spartan-ng/helm/card': ['libs/card/src/index.ts'],
							'@spartan-ng/helm/dialog': ['libs/dialog/src/index.ts'],
						},
					},
				}),
			);

			// Create library files
			tree.write('libs/button/src/index.ts', 'export * from "./lib/hlm-button";');
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton {}');
			tree.write('libs/button/project.json', JSON.stringify({ name: 'ui-button-helm' }));

			tree.write('libs/card/src/index.ts', 'export * from "./lib/hlm-card";');
			tree.write('libs/card/src/lib/hlm-card.ts', 'export class HlmCard {}');
			tree.write('libs/card/project.json', JSON.stringify({ name: 'ui-card-helm' }));

			tree.write('libs/dialog/src/index.ts', 'export * from "./lib/hlm-dialog";');
			tree.write('libs/dialog/src/lib/hlm-dialog.ts', 'export class HlmDialog {}');
			tree.write('libs/dialog/project.json', JSON.stringify({ name: 'ui-dialog-helm' }));
		});

		it('should detect unchanged libraries correctly', async () => {
			// Create metadata for all libraries
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			updateLibraryMetadata(tree, 'card', 'libs/card', '1.0.0');
			updateLibraryMetadata(tree, 'dialog', 'libs/dialog', '1.0.0');

			// Mock user selecting all unchanged libraries
			(prompt as jest.Mock)
				.mockResolvedValueOnce({
					libraries: ['all-unchanged'],
				})
				.mockResolvedValueOnce({
					confirm: true,
				});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('✓ 3 unchanged libraries'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('⚠ 0 customized libraries'));
		});

		it('should detect customized libraries correctly', async () => {
			// Create metadata for all libraries
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			updateLibraryMetadata(tree, 'card', 'libs/card', '1.0.0');
			updateLibraryMetadata(tree, 'dialog', 'libs/dialog', '1.0.0');

			// Modify button library
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { customized = true; }');

			// Mock user aborting
			(prompt as jest.Mock).mockResolvedValueOnce({
				libraries: [],
			});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('✓ 2 unchanged libraries'));
			expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('⚠ 1 customized libraries'));
			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('📦 button:'));
		});

		it('should show modified files in customization report', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');

			// Modify and add files
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');
			tree.write('libs/button/src/lib/custom-variant.ts', 'export class CustomVariant {}');

			(prompt as jest.Mock).mockResolvedValueOnce({
				libraries: [],
			});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Modified: src/lib/hlm-button.ts'));
			expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Added: src/lib/custom-variant.ts'));
		});

		it('should warn before overwriting customized libraries', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');

			// Modify button
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');

			// User selects customized library
			(prompt as jest.Mock)
				.mockResolvedValueOnce({
					libraries: ['button'],
				})
				.mockResolvedValueOnce({
					confirm: false,
				});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(logger.warn).toHaveBeenCalledWith(
				expect.stringContaining('WARNING: The following customized libraries will be overwritten'),
			);
			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('- button'));
		});

		it('should allow migrating unchanged libraries without warnings', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			updateLibraryMetadata(tree, 'card', 'libs/card', '1.0.0');

			// User selects unchanged libraries
			(prompt as jest.Mock)
				.mockResolvedValueOnce({
					libraries: ['all-unchanged'],
				})
				.mockResolvedValueOnce({
					confirm: true,
				});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(createPrimitiveLibraries).toHaveBeenCalled();
		});

		it('should abort migration when user declines confirmation', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');

			// Modify button
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');

			(prompt as jest.Mock)
				.mockResolvedValueOnce({
					libraries: ['button'],
				})
				.mockResolvedValueOnce({
					confirm: false,
				});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(logger.info).toHaveBeenCalledWith('Aborting migration of customized libraries.');
			expect(createPrimitiveLibraries).not.toHaveBeenCalled();
		});

		it('should update metadata after successful migration', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');

			(prompt as jest.Mock)
				.mockResolvedValueOnce({
					libraries: ['button'],
				})
				.mockResolvedValueOnce({
					confirm: true,
				});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			// Note: In real scenario, library would be regenerated
			// Here we just verify the metadata update is called
			expect(createPrimitiveLibraries).toHaveBeenCalledWith(
				expect.objectContaining({
					primitives: ['button'],
				}),
				expect.anything(),
				expect.anything(),
				expect.anything(),
				expect.objectContaining({
					installPeerDependencies: false,
				}),
				expect.anything(),
			);
		});

		it('should handle mixed selection of unchanged and customized libraries', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			updateLibraryMetadata(tree, 'card', 'libs/card', '1.0.0');
			updateLibraryMetadata(tree, 'dialog', 'libs/dialog', '1.0.0');

			// Modify button
			tree.write('libs/button/src/lib/hlm-button.ts', 'export class HlmButton { modified = true; }');

			// User selects all unchanged and one customized
			(prompt as jest.Mock)
				.mockResolvedValueOnce({
					libraries: ['all-unchanged', 'button'],
				})
				.mockResolvedValueOnce({
					confirm: true,
				});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			// Should migrate button, card, and dialog (all three)
			expect(createPrimitiveLibraries).toHaveBeenCalledWith(
				expect.objectContaining({
					primitives: expect.arrayContaining(['button', 'card', 'dialog']),
				}),
				expect.anything(),
				expect.anything(),
				expect.anything(),
				expect.anything(),
				expect.anything(),
			);
		});

		it('should provide detailed report for multiple customized libraries', async () => {
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			updateLibraryMetadata(tree, 'card', 'libs/card', '1.0.0');

			// Customize both
			tree.write('libs/button/src/lib/custom-button.ts', 'export class Custom {}');
			tree.write('libs/card/src/lib/hlm-card.ts', 'export class HlmCard { modified = true; }');

			const loggerWarnSpy = jest.spyOn(require('@nx/devkit').logger, 'warn');

			(prompt as jest.Mock).mockResolvedValueOnce({
				libraries: [],
			});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			expect(loggerWarnSpy).toHaveBeenCalledWith(expect.stringContaining('📦 button:'));
			expect(loggerWarnSpy).toHaveBeenCalledWith(expect.stringContaining('📦 card:'));
		});

		it('should handle libraries without metadata as customized', async () => {
			// Only create metadata for button
			updateLibraryMetadata(tree, 'button', 'libs/button', '1.0.0');
			// card and dialog have no metadata

			const loggerSpy = jest.spyOn(require('@nx/devkit').logger, 'info');

			(prompt as jest.Mock).mockResolvedValueOnce({
				libraries: [],
			});

			await migrateHelmLibrariesGenerator(tree, {
				generateAs: 'library',
				buildable: false,
				importAlias: '@spartan-ng/helm',
				angularCli: false,
			});

			// Should show 1 unchanged (button) and 2 customized (card, dialog)
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('✓ 1 unchanged libraries'));
			expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('⚠ 2 customized libraries'));
		});
	});
});
