import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateProgressGenerator } from './generator';

// patch some imports to avoid running the actual code
vi.mock('enquirer');
vi.mock('@nx/devkit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@nx/devkit')>();
	return {
		...original,
		ensurePackage: (pkg: string) => require(pkg),
		createProjectGraphAsync: vi.fn().mockResolvedValue({
			nodes: {},
			dependencies: {},
		}),
	};
});

describe('migrate-progress generator', () => {
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

	it('should replace brn-progress helm elements', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
			import { Component } from '@angular/core';

			@Component({
				template: \`
					<brn-progress hlm class="w-80" aria-labelledby="loading" [value]="value">
						<brn-progress-indicator hlm />
					</brn-progress>
				\`
			})
			export class AppModule {}

			`,
		);

		await migrateProgressGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`<hlm-progress  class="w-80" aria-labelledby="loading" [value]="value">`);
		expect(content).toContain(`<hlm-progress-indicator  />`);
		expect(content).toContain(`</hlm-progress>`);
	});

	it('should not replace brn-progress elements without a hlm attribute', () => {
		tree.write(
			'app/src/app/app.component.ts',
			`

			@Component({
				template: \`
					<brn-progress class="w-80" aria-labelledby="loading" [value]="value">
						<brn-progress-indicator />
					</brn-progress>
				\`
			})
			export class AppModule {}
			`,
		);

		migrateProgressGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`<brn-progress class="w-80" aria-labelledby="loading" [value]="value">`);
		expect(content).toContain(`<brn-progress-indicator />`);
		expect(content).toContain(`</brn-progress>`);
	});
});
