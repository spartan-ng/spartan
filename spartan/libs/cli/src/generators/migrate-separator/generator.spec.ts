import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateSeparatorGenerator } from './generator';

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

describe('migrate-separator generator', () => {
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

	it('should remove BrnSeparator (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { BrnSeparator } from '@spartan-ng/brain/separator';
			import { HlmSeparator } from '@spartan-ng/helm/separator';

			@NgModule({
				imports: [BrowserModule, BrnSeparator, HlmSeparator],
			})
			export class AppModule {}
			`,
		);

		await migrateSeparatorGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSeparator } from '@spartan-ng/brain/separator';`);
		expect(content).toContain(`imports: [BrowserModule, HlmSeparator],`);
	});

	it('should replace BrnSeparator template (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnSeparator } from '@spartan-ng/brain/separator';
				import { HlmSeparator } from '@spartan-ng/helm/separator';
				@Component({
					imports: [BrnSeparator, HlmSeparator],
					template: \`
						<brn-separator hlmSeparator class="my-4" />
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateSeparatorGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnSeparator } from '@spartan-ng/brain/separator';`);
		expect(content).toContain(`import { HlmSeparator } from '@spartan-ng/helm/separator';`);
		expect(content).toContain(`imports: [HlmSeparator],`);
		expect(content).toContain(`<hlm-separator class="my-4" />`);
	});
	it('should replace BrnSeparator also if the hlmSeparator is not directly after the brn-separator tag (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnSeparator } from '@spartan-ng/brain/separator';
				import { HlmSeparator } from '@spartan-ng/helm/separator';

				@Component({
					imports: [BrnSeparator, HlmSeparator],
					template: \`
						<brn-separator orientation="vertical" hlmSeparator />
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateSeparatorGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`<hlm-separator orientation="vertical" />`);
	});
});
