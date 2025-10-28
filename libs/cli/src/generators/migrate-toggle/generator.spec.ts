import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateToggleGenerator } from './generator';

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

describe('migrate-toggle generator', () => {
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

	it('should remove BrnToggle (NgModule)', async () => {
		tree.write(
			'app/src/app/app.module.ts',
			`
			import { NgModule } from '@angular/core';
			import { BrowserModule } from '@angular/platform-browser';
			import { BrnToggle } from '@spartan-ng/brain/toggle';
			import { HlmToggle } from '@spartan-ng/helm/toggle';

			@NgModule({
				imports: [BrowserModule, BrnToggle, HlmToggle],
			})
			export class AppModule {}
			`,
		);

		await migrateToggleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.module.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggle } from '@spartan-ng/brain/toggle';`);
		expect(content).toContain(`imports: [BrowserModule, HlmToggle],`);
	});

	it('should replace BrnToggle template (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnToggle } from '@spartan-ng/brain/toggle';
				import { HlmToggle } from '@spartan-ng/helm/toggle';
				@Component({
					imports: [BrnToggle, HlmToggle],
					template: \`
						<button brnToggle hlm>Toggle</button>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateToggleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).not.toContain(`import { BrnToggle } from '@spartan-ng/brain/toggle';`);
		expect(content).toContain(`import { HlmToggle } from '@spartan-ng/helm/toggle';`);
		expect(content).toContain(`imports: [HlmToggle],`);
		expect(content).toContain(`<button hlmToggle>Toggle</button>`);
	});
	it('should replace BrnToggle also if the HlmToggle is not directly after the brnToggle directive (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnToggle } from '@spartan-ng/brain/toggle';
				import { HlmToggle } from '@spartan-ng/helm/toggle';

				@Component({
					imports: [BrnToggle, HlmToggle],
					template: \`
						<button brnToggle type="button" hlm>Toggle</button>
					\`
				})
				export class AppModule {}
				`,
		);

		await migrateToggleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`<button hlmToggle type="button">Toggle</button>`);
	});
	it('should not replace BrnToggleGroup import (Standalone)', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';
				import { BrnToggleGroup, BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';
				import { HlmToggleGroup, HlmToggleGroupItem } from '@spartan-ng/helm/toggle-group';

				@Component({
					imports: [BrnToggleGroup, BrnToggleGroupItem, HlmToggleGroup, HlmToggleGroupItem],
				})
				export class AppModule {}
				`,
		);

		await migrateToggleGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import { BrnToggleGroup, BrnToggleGroupItem } from '@spartan-ng/brain/toggle-group';`);
	});
});
