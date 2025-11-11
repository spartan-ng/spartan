import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateCollapsibleGenerator } from './generator';

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

describe('migrate-collapsible generator', () => {
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

	it('should remove BrnCollapsibleImports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
	
				@NgModule({
					imports: [BrowserModule, BrnCollapsibleImports],
				})
				export class AppModule {}
				`,
		);

		await migrateCollapsibleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';`);
		expect(content).toContain(`import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';`);
		expect(content).toContain(`imports: [BrowserModule, HlmCollapsibleImports],`);
	});

	it('should remove BrnCollapsibleImports between imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { NgIcon } from '@ng-icons/core';
				import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
				import { HlmIcon } from '@spartan-ng/helm/icon';
				import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
	
				@NgModule({
					imports: [HlmIcon, NgIcon, BrnCollapsibleImports, HlmSidebarImports],
				})
				export class AppModule {}
				`,
		);

		await migrateCollapsibleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';`);
		expect(content).toContain(`import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';`);
		expect(content).toContain(`imports: [HlmIcon, NgIcon, HlmCollapsibleImports, HlmSidebarImports],`);
	});

	it('should remove BrnCollapsible (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
				import { NgModule } from '@angular/core';
				import { BrowserModule } from '@angular/platform-browser';
				import { BrnCollapsible, BrnCollapsibleTrigger, BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
	
				@NgModule({
					imports: [BrowserModule, BrnCollapsible, BrnCollapsibleTrigger, BrnCollapsibleContent],
				})
				export class AppModule {}
				`,
		);

		await migrateCollapsibleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';`);
		expect(content).toContain(`import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';`);
		expect(content).toContain(`imports: [BrowserModule, HlmCollapsibleImports],`);
	});

	it('should replace BrnCollapsible template (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
					import { Component } from '@angular/core';
					import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';

					@Component({
						imports: [BrnCollapsibleImports],
						template: \`
							<brn-collapsible>
  								<button brnCollapsibleTrigger>Can I use this in my project?</button>
    							<brn-collapsible-content>
    								Yes. Free to use for personal and commercial projects. No attribution
    								required.
    							</brn-collapsible-content>
							</brn-collapsible>
						\`
					})
					export class AppModule {}
					`,
		);

		await migrateCollapsibleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';`);
		expect(content).toContain(`import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';`);
		expect(content).toContain(`imports: [HlmCollapsibleImports],`);
		expect(content).toContain(`<hlm-collapsible>`);
		expect(content).toContain(`<button hlmCollapsibleTrigger>Can I use this in my project?</button>`);
		expect(content).toContain(`<hlm-collapsible-content>`);
		expect(content).toContain(`</hlm-collapsible-content>`);
		expect(content).toContain(`</hlm-collapsible>`);
	});
});
