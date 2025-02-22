import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateRadioGenerator } from './generator';

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

describe('migrate-radio generator', () => {
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

	it('should remove BrnRadioComponent and replace HlmRadioDirective with HlmRadioComponent (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';
			import { HlmRadioDirective, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';

			@NgModule({
				imports: [BrowserModule, BrnRadioComponent, HlmRadioDirective, HlmRadioGroupComponent],
			})
			export class AppModule {}
			`,
		);

		await migrateRadioGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';`);
		expect(content).toContain(
			`import { HlmRadioComponent, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';`,
		);
		expect(content).toContain(`imports: [BrowserModule, HlmRadioComponent, HlmRadioGroupComponent],`);
	});

	it('should replace BrnRadioComponent template (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';
				import { HlmRadioDirective, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';
	
				@Component({
					imports: [BrnRadioComponent, HlmRadioDirective, HlmRadioGroupComponent],
					template: \`
						<hlm-radio-group class="font-mono text-sm font-medium" [(ngModel)]="version">
							<brn-radio hlm value="16.1.4">
								v16.1.4
							</brn-radio>
						</hlm-radio-group>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateRadioGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnRadioComponent } from '@spartan-ng/brain/radio-group';`);
		expect(content).toContain(
			`import { HlmRadioComponent, HlmRadioGroupComponent } from '@spartan-ng/ui-radiogroup-helm';`,
		);
		expect(content).toContain(`imports: [HlmRadioComponent, HlmRadioGroupComponent],`);
		expect(content).toContain(`<hlm-radio value="16.1.4">`);
	});
});
