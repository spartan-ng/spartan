import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateDatePickerGenerator } from './generator';

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

describe('migrate-date-picker generator', () => {
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

	it('should rename (changed) to (dateChange) on date-picker elements', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<hlm-date-picker (changed)="onOpenedChange($event)"></hlm-date-picker>
				<hlm-date-picker (changed)="onOpenedChange($event)" />
				<hlm-date-picker hlm (changed)="onOpenedChange($event)"></hlm-date-picker>
				<hlm-date-picker hlm (changed)="onOpenedChange($event)" />
				<hlm-date-picker-multi (changed)="onOpenedChange($event)"></hlm-date-picker-multi>
				<hlm-date-picker-multi (changed)="onOpenedChange($event)" />

				<!-- This is not a date-picker, so it should not be changed -->
				<div (changed)="onOpenedChange($event)"></div>
			`,
		);

		await migrateDatePickerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toBe(`
				<hlm-date-picker (dateChange)="onOpenedChange($event)"></hlm-date-picker>
				<hlm-date-picker (dateChange)="onOpenedChange($event)" />
				<hlm-date-picker hlm (dateChange)="onOpenedChange($event)"></hlm-date-picker>
				<hlm-date-picker hlm (dateChange)="onOpenedChange($event)" />
				<hlm-date-picker-multi (dateChange)="onOpenedChange($event)"></hlm-date-picker-multi>
				<hlm-date-picker-multi (dateChange)="onOpenedChange($event)" />

				<!-- This is not a date-picker, so it should not be changed -->
				<div (changed)="onOpenedChange($event)"></div>
			`);
	});
});
