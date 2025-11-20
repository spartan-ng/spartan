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

	it('should replace brain menu import (NgModule)', async () => {
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
});
