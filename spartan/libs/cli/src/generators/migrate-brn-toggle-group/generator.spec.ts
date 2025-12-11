import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateBrnToggleGroupGenerator } from './generator';

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

describe('migrate-toggle-group generator', () => {
	let tree: Tree;

	beforeEach(async () => {
		tree = await createTreeWithEmptyWorkspace();

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

	it('should remove BrnToggleGroup (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
				import { HlmToggleGroup } from '@spartan-ng/helm/toggle-group';
	
				@NgModule({
					imports: [BrowserModule, BrnToggleGroup, HlmToggleGroup],
				})
				export class AppModule {}
				`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';`);
		expect(content).toContain(`imports: [BrowserModule, HlmToggleGroup],`);
	});

	it('should remove BrnToggleGroupItem (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import { BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';
				import { HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';
	
				@NgModule({
					imports: [BrowserModule, BrnToggleGroupItem, HlmToggleGroupItem],
				})
				export class AppModule {}
				`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';`);
		expect(content).toContain(`imports: [BrowserModule, HlmToggleGroupItem],`);
	});

	it('should remove BrnToggleGroup imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import { BrnToggleGroup, BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';
				import { HlmToggleGroup, HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';
	
				@NgModule({
					imports: [BrowserModule, BrnToggleGroup, BrnToggleGroupItem, HlmToggleGroup, HlmToggleGroupItem],
				})
				export class AppModule {}
				`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(
			`import { BrnToggleGroup, BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';`,
		);
		expect(content).toContain(`imports: [BrowserModule, HlmToggleGroup, HlmToggleGroupItem],`);
	});

	it('should remove BrnToggleGroup imports in any order (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import { BrnToggleGroupItem, BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
				import { HlmToggleGroup, HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';
	
				@NgModule({
					imports: [BrowserModule, BrnToggleGroup, BrnToggleGroupItem, HlmToggleGroup, HlmToggleGroupItem],
				})
				export class AppModule {}
				`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(
			`import { BrnToggleGroup, BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';`,
		);
		expect(content).toContain(`imports: [BrowserModule, HlmToggleGroup, HlmToggleGroupItem],`);
	});

	it('should remove multi line BrnToggleGroup imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import {
					BrnToggleGroup,
					BrnToggleGroupItem,
				} from '@spartan-ng/brain/toggle-group';
				import { HlmToggleGroup, HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';
	
				@NgModule({
					imports: [BrowserModule, BrnToggleGroup, BrnToggleGroupItem, HlmToggleGroup, HlmToggleGroupItem],
				})
				export class AppModule {}
				`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`'@spartan-ng/brain/toggle-group';`);
		expect(content).toContain(`imports: [BrowserModule, HlmToggleGroup, HlmToggleGroupItem],`);
	});

	it('should replace BrnToggleGroup template (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
					import { Component } from '@angular/core';
					import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
					import { HlmToggleGroup } from '@spartan-ng/helm/toggle-group';
					@Component({
						imports: [BrnToggleGroup, HlmToggleGroup],
						template: \`
							<brn-toggle-group hlm type="multiple">...</brn-toggle-group>
						\`
					})
					export class AppModule {}
					`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';`);
		expect(content).toContain(`import { HlmToggleGroup } from '@spartan-ng/helm/toggle-group';`);
		expect(content).toContain(`imports: [HlmToggleGroup],`);
		expect(content).toContain(`<hlm-toggle-group type="multiple">...</hlm-toggle-group>`);
	});

	it('should replace BrnToggleGroup template properties multiple=false (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
					import { Component } from '@angular/core';
					import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
					import { HlmToggleGroup } from '@spartan-ng/helm/toggle-group';
					@Component({
						imports: [BrnToggleGroup, HlmToggleGroup],
						template: \`
							<brn-toggle-group hlm multiple="false">...</brn-toggle-group>
						\`
					})
					export class AppModule {}
					`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';`);
		expect(content).toContain(`<hlm-toggle-group type="single">...</hlm-toggle-group>`);
	});

	it('should replace BrnToggleGroup template properties multiple=true (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
					import { Component } from '@angular/core';
					import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';
					import { HlmToggleGroup } from '@spartan-ng/helm/toggle-group';
					@Component({
						imports: [BrnToggleGroup, HlmToggleGroup],
						template: \`
							<brn-toggle-group hlm multiple="true">...</brn-toggle-group>
						\`
					})
					export class AppModule {}
					`,
		);

		await migrateBrnToggleGroupGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggleGroup } from '@spartan-ng/brain/toggle-group';`);
		expect(content).toContain(`<hlm-toggle-group type="multiple">...</hlm-toggle-group>`);
	});
});
