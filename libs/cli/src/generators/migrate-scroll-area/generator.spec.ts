import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateScrollAreaGenerator } from './generator';

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

describe('migrate-scroll-area generator', () => {
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

	it('should add NgScrollbarImport (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { HlmScrollAreaModule } from '@spartan-ng/hlm-scroll-area';

			@NgModule({
				imports: [BrowserModule, HlmScrollAreaModule],
			})
			export class AppModule {}

			`,
		);

		await migrateScrollAreaGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).toContain(`import { NgScrollbarModule } from 'ngx-scrollbar';`);
		expect(content).toContain(`imports: [BrowserModule, NgScrollbarModule, HlmScrollAreaModule],`);
	});

	it('should replace HlmScrollAreaComponent (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { HlmScrollAreaComponent } from '@spartan-ng/hlm-scroll-area';

			@NgModule({
				imports: [BrowserModule, HlmScrollAreaComponent],
			})
			export class AppModule {}

			`,
		);

		await migrateScrollAreaGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).toContain(`import { NgScrollbarModule } from 'ngx-scrollbar';`);
		expect(content).toContain(`imports: [BrowserModule, NgScrollbarModule, HlmScrollAreaDirective],`);
	});

	it('should add NgScrollbarImport (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { HlmScrollAreaModule } from '@spartan-ng/hlm-scroll-area';

			@Component({
				imports: [HlmScrollAreaModule],
				template: \`
					<hlm-scroll-area class="w-48 border h-72 rounded-md border-border">Content</hlm-scroll-area>
				\`
			})
			export class AppModule {}

			`,
		);

		await migrateScrollAreaGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import { NgScrollbarModule } from 'ngx-scrollbar';`);
		expect(content).toContain(`imports: [NgScrollbarModule, HlmScrollAreaModule],`);
		expect(content).toContain(
			`<ng-scrollbar hlm class="w-48 border h-72 rounded-md border-border">Content</ng-scrollbar>`,
		);
	});

	it('should replace HlmScrollAreaComponent (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { HlmScrollAreaComponent } from '@spartan-ng/hlm-scroll-area';

			@Component({
				imports: [HlmScrollAreaComponent],
				template: \`
					<hlm-scroll-area class="w-48 border h-72 rounded-md border-border">Content</hlm-scroll-area>
				\`
			})
			export class AppModule {}

			`,
		);

		await migrateScrollAreaGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import { NgScrollbarModule } from 'ngx-scrollbar';`);
		expect(content).toContain(`import { HlmScrollAreaDirective } from '@spartan-ng/hlm-scroll-area';`);
		expect(content).toContain(`imports: [NgScrollbarModule, HlmScrollAreaDirective],`);
		expect(content).toContain(
			`<ng-scrollbar hlm class="w-48 border h-72 rounded-md border-border">Content</ng-scrollbar>`,
		);
	});
});
