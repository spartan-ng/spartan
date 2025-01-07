import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateCoreGenerator } from './generator';
import { MigrateCoreGeneratorSchema } from './schema';

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

describe('migrate-core generator', () => {
	let tree: Tree;
	const options: MigrateCoreGeneratorSchema = { skipFormat: true };

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

	it('should update the import statements', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { hlm } from '@spartan-ng/ui-core';

			@Component({
				template: \`
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import { hlm } from '@spartan-ng/brain/core';`);
	});

	it('should update the import statements with multiple imports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import { hlm, brnZoneFull, createInjectionToken, ExposesState } from '@spartan-ng/ui-core';

			@Component({
				template: \`
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(
			`import { hlm, brnZoneFull, createInjectionToken, ExposesState } from '@spartan-ng/brain/core';`,
		);
	});

	it('should import type only imports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import type { hlm } from '@spartan-ng/ui-core';

			@Component({
				template: \`
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import type { hlm } from '@spartan-ng/brain/core';`);
	});

	it('should update default imports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import hlm from '@spartan-ng/ui-core';

			@Component({
				template: \`
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import hlm from '@spartan-ng/brain/core';`);
	});

	it('should update star imports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';
			import * as hlm from '@spartan-ng/ui-core';

			@Component({
				template: \`
				\`
			})
			export class AppComponent {}
			`,
		);

		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`import * as hlm from '@spartan-ng/brain/core';`);
	});

	it('should update exports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			export { hlm } from '@spartan-ng/ui-core';
			`,
		);
		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`export { hlm } from '@spartan-ng/brain/core';`);
	});

	it('should update star exports', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			export * from '@spartan-ng/ui-core';
			`,
		);
		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`export * from '@spartan-ng/brain/core';`);
	});

	it('should update the tailwind config file', async () => {
		tree.write(
			'app/tailwind.config.js',
			`
/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
	content: [
		'./src/**/*.{html,ts}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
			`,
		);

		await migrateCoreGenerator(tree, options);

		const content = tree.read('app/tailwind.config.js', 'utf-8');
		expect(content).toContain(`/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
	content: [
		'./src/**/*.{html,ts}',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};`);
	});
});
