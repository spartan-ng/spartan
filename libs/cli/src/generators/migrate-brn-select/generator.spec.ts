import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateBrnSelectGenerator from './generator';

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

describe('migrate-brn-select generator', () => {
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

	it('should replace brn-select imports (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
					import { NgModule } from '@angular/core';
					import { BrowserModule } from '@angular/platform-browser';
					import { BrnSelectImports } from '@spartan-ng/brain/select';
					import { HlmSelectImports } from '@spartan-ng/helm/select';
		
					@NgModule({
						imports: [BrowserModule, BrnSelectImports, HlmSelectImports],
					})
					export class AppModule {}
					`,
		);

		await migrateBrnSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSelectImports } from '@spartan-ng/brain/select';`);
		expect(content).toContain(`import { HlmSelectImports } from '@spartan-ng/helm/select';`);
		expect(content).toContain(`imports: [BrowserModule, HlmSelectImports],`);
	});

	it('should replace brn-select selector (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
							import { Component, signal } from '@angular/core';
							import { BrnSelectImports } from '@spartan-ng/brain/select';
							import { HlmSelectImports } from '@spartan-ng/helm/select';
		
							@Component({
								imports: [BrnSelectImports, HlmSelectImports],
								template: \`
									<brn-select class="inline-block" placeholder="Select an option">
										<hlm-select-trigger class="w-56">
											<hlm-select-value />
										</hlm-select-trigger>
										<hlm-select-content>
											<hlm-option value="Refresh">Refresh</hlm-option>
											<hlm-option value="Settings">Settings</hlm-option>
											<hlm-option value="Help">Help</hlm-option>
											<hlm-option value="Signout">Sign out</hlm-option>
										</hlm-select-content>
									</brn-select>
								\`
							})
							export class AppModule {}
							`,
		);

		await migrateBrnSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSelectImports } from '@spartan-ng/brain/select'`);
		expect(content).not.toContain(`<brn-select class="inline-block" placeholder="Select an option">`);
		expect(content).toContain(`import { HlmSelectImports } from '@spartan-ng/helm/select';`);
		expect(content).toContain(`imports: [HlmSelectImports],`);
		expect(content).toContain(`<hlm-select class="inline-block">`);
		expect(content).toContain(`<hlm-select-value placeholder="Select an option" />`);
		expect(content).toContain(`<hlm-select-content *hlmSelectPortal>`);
		expect(content).toContain(`<hlm-select-group>`);
		expect(content).toContain(`<hlm-select-item value="Refresh">Refresh</hlm-select-item>`);
		expect(content).toContain(`</hlm-select-group>`);
		expect(content).toContain(`</hlm-select-content>`);
		expect(content).toContain(`</hlm-select>`);
	});

	it('should add *hlmSelectPortal (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
							import { Component, signal } from '@angular/core';
							import { BrnSelectImports } from '@spartan-ng/brain/select';
							import { HlmSelectImports } from '@spartan-ng/helm/select';
		
							@Component({
								imports: [BrnSelectImports, HlmSelectImports],
								template: \`
									<brn-select>
										<hlm-select-trigger class="w-56">
											<hlm-select-value />
										</hlm-select-trigger>
										<hlm-select-content class="min-w-max rounded-xl">
											<hlm-option value="Refresh">Refresh</hlm-option>
											<hlm-option value="Settings">Settings</hlm-option>
											<hlm-option value="Help">Help</hlm-option>
											<hlm-option value="Signout">Sign out</hlm-option>
										</hlm-select-content>
									</brn-select>
								\`
							})
							export class AppModule {}
							`,
		);

		await migrateBrnSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSelectImports } from '@spartan-ng/brain/select'`);
		expect(content).not.toContain(`<brn-select class="inline-block" placeholder="Select an option">`);
		expect(content).toContain(`import { HlmSelectImports } from '@spartan-ng/helm/select';`);
		expect(content).toContain(`imports: [HlmSelectImports],`);
		expect(content).toContain(`<hlm-select>`);
		expect(content).toContain(`<hlm-select-value />`);
		expect(content).toContain(`<hlm-select-content *hlmSelectPortal class="min-w-max rounded-xl">`);
		expect(content).toContain(`<hlm-select-group>`);
		expect(content).toContain(`<hlm-select-item value="Refresh">Refresh</hlm-select-item>`);
		expect(content).toContain(`</hlm-select-group>`);
		expect(content).toContain(`</hlm-select-content>`);
		expect(content).toContain(`</hlm-select>`);
	});

	it('should handle two brn-select placeholders  (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
							import { Component, signal } from '@angular/core';
							import { BrnSelectImports } from '@spartan-ng/brain/select';
							import { HlmSelectImports } from '@spartan-ng/helm/select';
		
							@Component({
								imports: [BrnSelectImports, HlmSelectImports],
								template: \`
									<brn-select placeholder="MM">
										<hlm-select-trigger class="w-56">
											<hlm-select-value />
										</hlm-select-trigger>
									</brn-select>
									<brn-select placeholder="YYYY">
										<hlm-select-trigger class="w-56">
											<hlm-select-value />
										</hlm-select-trigger>
									</brn-select>
								\`
							})
							export class AppModule {}
							`,
		);

		await migrateBrnSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSelectImports } from '@spartan-ng/brain/select'`);
		expect(content).not.toContain(`<brn-select placeholder="MM">`);
		expect(content).not.toContain(`<brn-select placeholder="YYYY">`);
		expect(content).toContain(`import { HlmSelectImports } from '@spartan-ng/helm/select';`);
		expect(content).toContain(`imports: [HlmSelectImports],`);
		expect(content).toContain(`<hlm-select-value placeholder="MM" />`);
		expect(content).toContain(`<hlm-select-value placeholder="YYYY" />`);
	});

	it('should move placeholder to hlm-select-value (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
							import { Component, signal } from '@angular/core';
							import { BrnSelectImports } from '@spartan-ng/brain/select';
							import { HlmSelectImports } from '@spartan-ng/helm/select';
		
							@Component({
								imports: [BrnSelectImports, HlmSelectImports],
								template: \`
									<brn-select placeholder="Select an option">
										<hlm-select-trigger class="w-56">
											<hlm-select-value />
										</hlm-select-trigger>
										<hlm-select-content>
											<hlm-option value="Refresh">Refresh</hlm-option>
											<hlm-option value="Settings">Settings</hlm-option>
											<hlm-option value="Help">Help</hlm-option>
											<hlm-option value="Signout">Sign out</hlm-option>
										</hlm-select-content>
									</brn-select>
									<input hlmInput placeholder="This should not be moved" />
								\`
							})
							export class AppModule {}
							`,
		);

		await migrateBrnSelectGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSelectImports } from '@spartan-ng/brain/select'`);
		expect(content).not.toContain(`<brn-select placeholder="Select an option">`);
		expect(content).toContain(`import { HlmSelectImports } from '@spartan-ng/helm/select';`);
		expect(content).toContain(`imports: [HlmSelectImports],`);
		expect(content).toContain(`<hlm-select>`);
		expect(content).toContain(`<hlm-select-value placeholder="Select an option" />`);
		expect(content).toContain(`<input hlmInput placeholder="This should not be moved" />`);
	});
});
