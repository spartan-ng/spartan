import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateDialogPortalGenerator from './generator';

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

describe('migrate-dialog-portal generator', () => {
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

	it('should replace *brnDialogContent (Standalone)', async () => {
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
  									<button hlmDialogTrigger hlmBtn variant="outline">Open Dialog</button>
  									<hlm-dialog-content *brnDialogContent="let ctx">
    									<hlm-dialog-header>
      										<h3 hlmDialogTitle>Edit profile</h3>
      										<p hlmDialogDescription>Make changes to your profile here. Click save when you're done.</p>
    									</hlm-dialog-header>
    									<hlm-dialog-footer>
      										<button hlmBtn variant="outline" hlmDialogCloseBtn>Cancel</button>
      										<button hlmBtn type="submit">Save changes</button>
    									</hlm-dialog-footer>
  									</hlm-dialog-content>
								</hlm-dialog>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<hlm-dialog-content *brnDialogContent="let ctx">`);
		expect(content).not.toContain(`import { BrnDialogImports } from '@spartan-ng/brain/dialog';`);
		expect(content).toContain(`<hlm-dialog-content *hlmDialogPortal="let ctx">`);
		expect(content).toContain(`imports: [HlmDialogImports],`);
	});

	it('should replace *brnAlertDialogContent (Standalone)', async () => {
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
  									<button hlmAlertDialogTrigger hlmBtn variant="outline">Open Alert Dialog</button>
  									<hlm-alert-dialog-content *brnAlertDialogContent="let ctx">
    									<hlm-alert-dialog-header>
      										<h3 hlmAlertDialogTitle>Edit profile</h3>
      										<p hlmAlertDialogDescription>Make changes to your profile here. Click save when you're done.</p>
    									</hlm-alert-dialog-header>
    									<hlm-alert-dialog-footer>
      										<button hlmAlertDialogCancel (click)="ctx.close()">Cancel</button>
      										<button hlmAlertDialogAction (click)="ctx.close()">Continue</button>
    									</hlm-alert-dialog-footer>
  									</hlm-alert-dialog-content>
								</hlm-alert-dialog>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<hlm-alert-dialog-content *brnAlertDialogContent="let ctx">`);
		expect(content).not.toContain(`import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';`);
		expect(content).toContain(`<hlm-alert-dialog-content *hlmAlertDialogPortal="let ctx">`);
		expect(content).toContain(`imports: [HlmAlertDialogImports],`);
	});

	it('should replace *brnPopoverContent (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnPopoverImports } from '@spartan-ng/brain/popover';
						import { HlmPopoverImports } from '@spartan-ng/helm/popover';

						@Component({
							imports: [BrnPopoverImports, HlmPopoverImports],
							template: \`
								<hlm-popover>
  									<button hlmPopoverTrigger>Open Popover</button>
  									<div hlmPopoverContent *brnPopoverContent="let ctx"></div>
								</hlm-popover>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<div hlmPopoverContent *brnPopoverContent="let ctx"></div>`);
		expect(content).not.toContain(`import { BrnPopoverImports } from '@spartan-ng/brain/popover';`);
		expect(content).toContain(`<div hlmPopoverContent *hlmPopoverPortal="let ctx"></div>`);
		expect(content).toContain(`imports: [HlmPopoverImports],`);
	});

	it('should replace *brnSheetContent (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnSheetImports } from '@spartan-ng/brain/sheet';
						import { HlmSheetImports } from '@spartan-ng/helm/sheet';

						@Component({
							imports: [BrnSheetImports, HlmSheetImports],
							template: \`
								<hlm-sheet>
  									<button hlmSheetTrigger hlmBtn variant="outline">Open</button>
  									<hlm-sheet-content *brnSheetContent="let ctx">
    									<hlm-sheet-header>
      										<h3 hlmSheetTitle>Are you absolutely sure?</h3>
      										<p hlmSheetDescription>
        									This action cannot be undone. This will permanently delete your account and remove your data from our servers.
      										</p>
    									</hlm-sheet-header>
  									</hlm-sheet-content>
								</hlm-sheet>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<hlm-sheet-content *brnSheetContent="let ctx">`);
		expect(content).not.toContain(`import { BrnSheetImports } from '@spartan-ng/brain/sheet';`);
		expect(content).toContain(`<hlm-sheet-content *hlmSheetPortal="let ctx">`);
		expect(content).toContain(`imports: [HlmSheetImports],`);
	});

	it('should replace *brnNavigationMenuContent (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
						import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';

						@Component({
							imports: [BrnNavigationMenuImports, HlmNavigationMenuImports],
							template: \`
								<nav hlmNavigationMenu>
									<ul hlmNavigationMenuList>
										<li hlmNavigationMenuItem>
											<button hlmNavigationMenuTrigger>Home</button>
											<div hlmNavigationMenuContent *brnNavigationMenuContent>
												<div>Content</div>
											</div>
										<li>
									</ul>
								</nav>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<div hlmNavigationMenuContent *brnNavigationMenuContent>`);
		expect(content).not.toContain(`import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';`);
		expect(content).toContain(`<div hlmNavigationMenuContent *hlmNavigationMenuPortal>`);
		expect(content).toContain(`imports: [HlmNavigationMenuImports],`);
	});

	it('should replace *brnPopoverContent for combobox (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnPopoverContent } from '@spartan-ng/brain/popover';
						import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

						@Component({
							imports: [HlmComboboxImports, BrnPopoverContent],
							template: \`
								<hlm-combobox>
  									<hlm-combobox-input placeholder="Select a framework" />
  									<div *brnPopoverContent hlmComboboxContent>
    									<hlm-combobox-empty>No items found.</hlm-combobox-empty>
    									<div hlmComboboxList>
      										@for (framework of frameworks; track $index) {
      											<hlm-combobox-item [value]="framework">{{ framework.label }}</hlm-combobox-item>
      										}
    									</div>
  									</div>
								</hlm-combobox>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<div *brnPopoverContent hlmComboboxContent>`);
		expect(content).not.toContain(`import { BrnPopoverContent } from '@spartan-ng/brain/popover';`);
		expect(content).toContain(`<div *hlmPopoverPortal hlmComboboxContent>`);
		expect(content).toContain(`import { HlmPopoverImports } from '@spartan-ng/helm/popover';`);
		expect(content).toContain(`imports: [HlmComboboxImports, HlmPopoverImports],`);
	});

	it('should replace *brnPopoverContent for autocomplete (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnPopoverContent } from '@spartan-ng/brain/popover';
						import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';


						@Component({
							imports: [BrnPopoverContent, HlmAutocompleteImports],
							template: \`
								<hlm-autocomplete [(search)]="search">
  									<hlm-autocomplete-input placeholder="Search tags" />
  									<div *brnPopoverContent hlmAutocompleteContent>
  										<hlm-autocomplete-empty>No tags found.</hlm-autocomplete-empty>
    									<div hlmAutocompleteList>
      										@for (option of filteredOptions(); track $index) {
      											<hlm-autocomplete-item [value]="option"> {{ option }} </hlm-autocomplete-item>
      										}
    									</div>
  									</div>
								</hlm-autocomplete>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateDialogPortalGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<div *brnPopoverContent hlmAutocompleteContent>`);
		expect(content).not.toContain(`import { BrnPopoverContent } from '@spartan-ng/brain/popover';`);
		expect(content).toContain(`<div *hlmPopoverPortal hlmAutocompleteContent>`);
		expect(content).toContain(`import { HlmPopoverImports } from '@spartan-ng/helm/popover';`);
		expect(content).toContain(`imports: [HlmPopoverImports, HlmAutocompleteImports],`);
	});
});
