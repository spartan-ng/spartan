import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateDialogGenerator from './generator';

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

describe('migrate-dialog generator', () => {
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

	it('should replace brnAlertDialogTrigger (NgModule)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component, signal } from '@angular/core';
				import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
				import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';

				@Component({
					imports: [BrnAlertDialogImports, HlmAlertDialogImports],
					template: \`
						<hlm-alert-dialog>
							<button brnAlertDialogTrigger>Show Dialog</button>
							<hlm-alert-dialog-content>
							</hlm-alert-dialog-content>
						</hlm-alert-dialog>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateDialogGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<button brnAlertDialogTrigger>Show Dialog</button>`);
		expect(content).toContain(`<button hlmAlertDialogTrigger>Show Dialog</button>`);
	});

	it('should replace brnDialogTrigger (NgModule)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component, signal } from '@angular/core';
				import { BrnDialogImports } from '@spartan-ng/brain/dialog';
				import { HlmDialogImports } from '@spartan-ng/helm/dialog';

				@Component({
					imports: [BrnDialogImports, HlmDialogImports],
					template: \`
						<hlm-dialog>
							<button brnDialogTrigger>Show Dialog</button>
							<hlm-dialog-content>
							</hlm-dialog-content>
						</hlm-dialog>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateDialogGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<button brnDialogTrigger>Show Dialog</button>`);
		expect(content).toContain(`<button hlmDialogTrigger>Show Dialog</button>`);
	});

	it('should replace brn-popover and brnPopoverTrigger (NgModule)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component, signal } from '@angular/core';
				import { BrnPopoverImports } from '@spartan-ng/brain/popover';
				import { HlmPopoverImports } from '@spartan-ng/helm/popover';

				@Component({
					imports: [BrnPopoverImports, HlmPopoverImports],
					template: \`
						<brn-popover sideOffset="5">
  							<button brnPopoverTrigger>Open Popover</button>
 							<div hlmPopoverContent *brnPopoverContent="let ctx"></div>
						</brn-popover>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateDialogGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<brn-popover sideOffset="5">`);
		expect(content).not.toContain(`</brn-popover>`);
		expect(content).not.toContain(`<button brnPopoverTrigger>Open Popover</button>`);
		expect(content).toContain(`<hlm-popover sideOffset="5">`);
		expect(content).toContain(`</hlm-popover>`);
		expect(content).toContain(`<button hlmPopoverTrigger>Open Popover</button>`);
	});

	it('should replace brnSheetTrigger (NgModule)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component, signal } from '@angular/core';
				import { BrnSheetImports } from '@spartan-ng/brain/sheet';
				import { HlmSheetImports } from '@spartan-ng/helm/sheet';

				@Component({
					imports: [BrnDialogImports, HlmDialogImports],
					template: \`
						<hlm-sheet>
							<button brnSheetTrigger>Open</button>
							<hlm-sheet-content>
							</hlm-sheet-content>
						</hlm-sheet>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateDialogGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<button brnSheetTrigger>Open</button>`);
		expect(content).toContain(`<button hlmSheetTrigger>Open</button>`);
	});
});
