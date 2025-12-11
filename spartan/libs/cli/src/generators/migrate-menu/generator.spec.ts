import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateMenuGenerator from './generator';

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

describe('migrate-menu generator', () => {
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

	it('should replace menu imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { BrowserModule } from '@angular/platform-browser';
					import { BrnMenuImports } from '@spartan-ng/brain/menu';
					import { HlmMenuImports } from '@spartan-ng/helm/menu';
		
					@NgModule({
						imports: [BrowserModule, BrnMenuImports, HlmMenuImports],
					})
					export class AppModule {}
					`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuImports } from '@spartan-ng/brain/menu';`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';`);
		expect(content).toContain(`imports: [BrowserModule, HlmDropdownMenuImports],`);
	});

	it('should replace BrnMenuImports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { BrowserModule } from '@angular/platform-browser';
					import { BrnMenuImports } from '@spartan-ng/brain/menu';
		
					@NgModule({
						imports: [BrowserModule, BrnMenuImports],
					})
					export class AppModule {}
					`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuImports } from '@spartan-ng/brain/menu';`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';`);
		expect(content).toContain(`imports: [BrowserModule, HlmDropdownMenuImports],`);
	});

	it('should replace standalone brain/helm menu imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { NgIcon } from '@ng-icons/core';
					import { BrnContextMenuTrigger, BrnMenuTrigger } from '@spartan-ng/brain/menu';
					import { HlmButton } from '@spartan-ng/helm/button';
					import { HlmIcon } from '@spartan-ng/helm/icon';
					import {
						HlmMenu,
						HlmMenuGroup,
						HlmMenuItem,
						HlmMenuItemCheckbox,
						HlmMenuItemRadioIndicator,
						HlmMenuLabel,
						HlmMenuSeparator,
					} from '@spartan-ng/helm/menu';
							
					@NgModule({
						imports: [
							HlmButton,
							NgIcon,
							HlmIcon,
							BrnMenuTrigger,
							BrnContextMenuTrigger,
							HlmMenu,
							HlmMenuLabel,
							HlmMenuItem,
							HlmMenuSeparator,
							HlmMenuGroup,
							HlmMenuItemRadioIndicator,
							HlmMenuItemCheckbox,
						],
					})
					export class AppModule {}
					`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuTrigger } from '@spartan-ng/brain/menu';`);
		expect(content).not.toContain(`'@spartan-ng/helm/menu'`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';`);
		expect(content).toContain(`import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';`);
		expect(content).toContain(`HlmDropdownMenuImports`);
		expect(content).toContain(`HlmContextMenuImports`);
	});

	it('should replace menu imports with custom importAlias (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { BrowserModule } from '@angular/platform-browser';
					import { BrnMenuImports } from '@spartan-ng/brain/menu';
					import { HlmMenuImports } from '@ui/menu';
		
					@NgModule({
						imports: [BrowserModule, BrnMenuImports, HlmMenuImports],
					})
					export class AppModule {}
					`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@ui' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuImports } from '@spartan-ng/brain/menu';`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@ui/dropdown-menu';`);
		expect(content).toContain(`imports: [BrowserModule, HlmDropdownMenuImports],`);
	});

	it('should replace brain menu import with custom importAlias (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { BrowserModule } from '@angular/platform-browser';
					import { BrnMenuImports } from '@spartan-ng/brain/menu';
		
					@NgModule({
						imports: [BrowserModule, BrnMenuImports],
					})
					export class AppModule {}
					`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@ui' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuImports } from '@spartan-ng/brain/menu';`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@ui/dropdown-menu';`);
		expect(content).toContain(`imports: [BrowserModule, HlmDropdownMenuImports],`);
	});

	it('should add HlmContextMenuImports import (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnMenuImports } from '@spartan-ng/brain/menu';
						import { HlmMenuImports } from '@spartan-ng/helm/menu';
	
						@Component({
							imports: [BrnMenuImports, HlmMenuImports],
							template: \`
								<div [brnCtxMenuTriggerFor]="menu">Right click here</div>

								<ng-template #menu>
  									<hlm-menu class="w-64">
    									<hlm-menu-group>
      										<button hlmMenuItem>Profile</button>
										</hlm-menu-group>
									</hlm-menu>
								</ng-template>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuImports } from '@spartan-ng/brain/menu'`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';`);
		expect(content).toContain(`import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu';`);
		expect(content).toContain(`imports: [HlmDropdownMenuImports, HlmContextMenuImports],`);
	});

	it('should add HlmMenubarImports import (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnMenuImports } from '@spartan-ng/brain/menu';
						import { HlmMenuImports } from '@spartan-ng/helm/menu';
	
						@Component({
							imports: [BrnMenuImports, HlmMenuImports],
							template: \`
								<hlm-menu-bar class="w-fit">
									<button hlmMenuBarItem [brnMenuTriggerFor]="file">File</button>
								</hlm-menu-bar>

								<ng-template #menu>
  									<hlm-menu class="w-64">
    									<hlm-menu-group>
      										<button hlmMenuItem>Profile</button>
										</hlm-menu-group>
									</hlm-menu>
								</ng-template>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnMenuImports } from '@spartan-ng/brain/menu'`);
		expect(content).toContain(`import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';`);
		expect(content).toContain(`import { HlmMenubarImports } from '@spartan-ng/helm/menubar';`);
		expect(content).toContain(`imports: [HlmDropdownMenuImports, HlmMenubarImports],`);
	});

	it('should replace brnCtxMenuTrigger selector (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnMenuImports } from '@spartan-ng/brain/menu';
						import { HlmMenuImports } from '@spartan-ng/helm/menu';
	
						@Component({
							imports: [BrnMenuImports, HlmMenuImports],
							template: \`
								<div [brnCtxMenuTriggerFor]="menu" [brnCtxMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }">Right click here</div>

								<ng-template #menu>
  									<hlm-menu class="w-64">
    									<hlm-menu-group>
      										<button hlmMenuItem>Profile</button>
										</hlm-menu-group>
									</hlm-menu>
								</ng-template>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(
			`[brnCtxMenuTriggerFor]="menu" [brnCtxMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }"`,
		);
		expect(content).toContain(`[hlmContextMenuTrigger]="menu"`);
		expect(content).toContain(`[hlmContextMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }"`);
	});

	it('should replace hlm-menu-bar and hlmMenuBarItem selectors (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnMenuImports } from '@spartan-ng/brain/menu';
						import { HlmMenuImports } from '@spartan-ng/helm/menu';
	
						@Component({
							imports: [BrnMenuImports, HlmMenuImports],
							template: \`
								<hlm-menu-bar class="w-fit">
									<button hlmMenuBarItem [brnMenuTriggerFor]="file">File</button>
									<button [brnMenuTriggerFor]="edit" hlmMenuBarItem>Edit</button>
								</hlm-menu-bar>

								<ng-template #menu>
  									<hlm-menu class="w-64">
    									<hlm-menu-group>
      										<button hlmMenuItem>Profile</button>
											<button hlmMenuItem align="start" side="right" [brnMenuTriggerFor]="share">
												Share
												<hlm-menu-item-sub-indicator />
											</button>
										</hlm-menu-group>
									</hlm-menu>
								</ng-template>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`<hlm-menu-bar class="w-fit">`);
		expect(content).not.toContain(`</hlm-menu-bar>`);
		expect(content).toContain(`<hlm-menubar class="w-fit">`);
		expect(content).toContain(`</hlm-menubar>`);
		expect(content).toContain(`<button  [hlmMenubarTrigger]="file">File</button>`);
		expect(content).toContain(`<button [hlmMenubarTrigger]="edit" >Edit</button>`);
		expect(content).toContain(
			`<button hlmDropdownMenuItem align="start" side="right" [hlmDropdownMenuTrigger]="share">`,
		);
	});

	it('should replace hlm-menu selectors (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnMenuImports } from '@spartan-ng/brain/menu';
						import { HlmMenuImports } from '@spartan-ng/helm/menu';
	
						@Component({
							imports: [BrnMenuImports, HlmMenuImports],
							template: \`
								<button hlmBtn variant="outline" align="end" [brnMenuTriggerFor]="menu">Open</button>

								<ng-template #menu>
  									<hlm-menu class="w-64">
										<hlm-menu-label>My Account</hlm-menu-label>
    									<hlm-menu-group>
      										<button hlmMenuItem>
												<span>Profile</span>
												<hlm-menu-shortcut>⇧⌘P</hlm-menu-shortcut>
											</button>
											<button hlmMenuItem align="start" side="right" [brnMenuTriggerFor]="share">
												Share
												<hlm-menu-item-sub-indicator />
											</button>
										</hlm-menu-group>
										<hlm-menu-separator />
										<hlm-menu-group>
											<button hlmMenuItemCheckbox [checked]="statusBar()" (triggered)="statusBar.set(!statusBar())">
												<hlm-menu-item-check />
												<span>Status Bar</span>
											</button>
										</hlm-menu-group>
										<hlm-menu-separator />
										<hlm-menu-group>
											<button hlmMenuItemRadio [checked]="p === 'top'" (triggered)="position.set('top')">
												<hlm-menu-item-radio />
												<span>Top</span>
											</button>
										</hlm-menu-group>
									</hlm-menu>
								</ng-template>

								<ng-template #share>
									<hlm-sub-menu>
										<button hlmMenuItem>Email</button>
									</hlm-sub-menu>
								</ng-template>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`[brnMenuTriggerFor]="menu"`);
		expect(content).toContain(
			`<button hlmBtn variant="outline" align="end" [hlmDropdownMenuTrigger]="menu">Open</button>`,
		);
		expect(content).toContain(`<hlm-dropdown-menu`);
		expect(content).toContain(`</hlm-dropdown-menu>`);
		expect(content).toContain(`<hlm-dropdown-menu-label>My Account</hlm-dropdown-menu-label>`);
		expect(content).toContain(`<hlm-dropdown-menu-group>`);
		expect(content).not.toContain(`hlmMenuItem`);
		expect(content).toContain(`<button hlmDropdownMenuItem>`);
		expect(content).toContain(`<hlm-dropdown-menu-separator />`);
		expect(content).toContain(`<hlm-dropdown-menu-shortcut>⇧⌘P</hlm-dropdown-menu-shortcut>`);
		expect(content).toContain(`<hlm-dropdown-menu-sub>`);
		expect(content).toContain(
			`<button hlmDropdownMenuCheckbox [checked]="statusBar()" (triggered)="statusBar.set(!statusBar())">`,
		);
		expect(content).toContain(`<hlm-dropdown-menu-checkbox-indicator />`);
		expect(content).toContain(
			`<button hlmDropdownMenuRadio [checked]="p === 'top'" (triggered)="position.set('top')">`,
		);
		expect(content).toContain(`<hlm-dropdown-menu-radio-indicator />`);
		expect(content).toContain(
			`<button hlmDropdownMenuItem align="start" side="right" [hlmDropdownMenuTrigger]="share">`,
		);
	});

	it('should replace trigger data selector (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component, signal } from '@angular/core';
						import { BrnMenuImports } from '@spartan-ng/brain/menu';
						import { HlmMenuImports } from '@spartan-ng/helm/menu';
						import { HlmButtonImports } from '@spartan-ng/helm/button';
	
						@Component({
							imports: [BrnMenuImports, HlmMenuImports, HlmButtonImports],
							template: \`
								<div [brnCtxMenuTriggerFor]="menu" [brnCtxMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }">Right click here</div>

								<button hlmBtn [brnMenuTriggerFor]="menu" [brnMenuTriggerData]="{ $implicit: { project } }">Open Menu</button>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateMenuGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(
			`[brnCtxMenuTriggerFor]="menu" [brnCtxMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }"`,
		);
		expect(content).toContain(`[hlmContextMenuTrigger]="menu"`);
		expect(content).toContain(`[hlmContextMenuTriggerData]="{ $implicit: { data: 'Changes Saved' } }"`);
		expect(content).toContain(
			`[hlmDropdownMenuTrigger]="menu" [hlmDropdownMenuTriggerData]="{ $implicit: { project } }"`,
		);
	});
});
