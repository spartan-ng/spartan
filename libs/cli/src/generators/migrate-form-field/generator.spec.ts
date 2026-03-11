import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateFormFieldGenerator from './generator';

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

	it('should replace form field imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
		
					@NgModule({
						imports: [BrowserModule, HlmFormFieldImports],
					})
					export class AppModule {}
					`,
		);

		await migrateFormFieldGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';`);
		expect(content).toContain(`import { HlmFieldImports } from '@spartan-ng/helm/field';`);
		expect(content).toContain(`imports: [BrowserModule, HlmFieldImports],`);
	});

	it('should replace form field imports with custom importAlias (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { HlmFormFieldImports } from '@ui/form-field';
		
					@NgModule({
						imports: [BrowserModule, HlmFormFieldImports],
					})
					export class AppModule {}
					`,
		);

		await migrateFormFieldGenerator(tree, { skipFormat: true, importAlias: '@ui' });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { HlmFormFieldImports } from '@ui/form-field';`);
		expect(content).toContain(`import { HlmFieldImports } from '@ui/field';`);
		expect(content).toContain(`imports: [BrowserModule, HlmFieldImports],`);
	});

	it('should replace hlm-form-field template (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
						import { Component } from '@angular/core';
						import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
						import { HlmInputImports } from '@spartan-ng/helm/input';
	
						@Component({
							imports: [HlmInputImports, HlmFormFieldImports,],
							template: \`
								<hlm-form-field>
									<input class="w-80" hlmInput [formControl]="control" type="email" placeholder="Email" />
									<hlm-hint>This is your email address.</hlm-hint>
									<hlm-error>The email is required.</hlm-error>
								</hlm-form-field>
							\`
						})
						export class AppModule {}
						`,
		);

		await migrateFormFieldGenerator(tree, { skipFormat: true, importAlias: '@spartan-ng/helm' });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';`);
		expect(content).not.toContain(`<hlm-form-field>`);
		expect(content).not.toContain(`<hlm-hint>This is your email address.</hlm-hint>`);
		expect(content).not.toContain(`<hlm-error>The email is required.</hlm-error>`);
		expect(content).toContain(`<hlm-field>`);
		expect(content).toContain(`<p hlmFieldDescription>This is your email address.</p>`);
		expect(content).toContain(`<hlm-field-error>The email is required.</hlm-field-error>`);
		expect(content).toContain(`</hlm-field>`);
	});
});
