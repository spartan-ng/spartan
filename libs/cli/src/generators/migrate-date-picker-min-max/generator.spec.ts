import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateDatePickerMinMaxGenerator } from './generator';

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

describe('migrate-date-picker-min-max generator', () => {
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

	it('should rename static min and max inputs on date picker elements in html templates', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<hlm-date-picker min="2024-01-01" max="2024-12-31"></hlm-date-picker>
				<hlm-date-picker-multi min="2024-01-01" max="2024-12-31"></hlm-date-picker-multi>
				<hlm-date-range-picker min="2024-01-01" max="2024-12-31"></hlm-date-range-picker>
				<hlm-month-year-picker min="2024-01-01" max="2024-12-31"></hlm-month-year-picker>
			`,
		);

		await migrateDatePickerMinMaxGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<hlm-date-picker minDate="2024-01-01" maxDate="2024-12-31">');
		expect(content).toContain('<hlm-date-picker-multi minDate="2024-01-01" maxDate="2024-12-31">');
		expect(content).toContain('<hlm-date-range-picker minDate="2024-01-01" maxDate="2024-12-31">');
		expect(content).toContain('<hlm-month-year-picker minDate="2024-01-01" maxDate="2024-12-31">');
	});

	it('should rename bound [min] and [max] inputs in inline templates', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';

				@Component({
					template: \`
						<hlm-date-picker [min]="minDate()" [max]="maxDate()" />
						<hlm-date-picker-multi [min]="myMin" [max]="myMax"></hlm-date-picker-multi>
						<hlm-date-range-picker [min]="rangeStart" [max]="rangeEnd" />
						<hlm-month-year-picker [min]="yearMin" [max]="yearMax" />
					\`,
				})
				export class AppComponent {}
			`,
		);

		await migrateDatePickerMinMaxGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('<hlm-date-picker [minDate]="minDate()" [maxDate]="maxDate()" />');
		expect(content).toContain('<hlm-date-picker-multi [minDate]="myMin" [maxDate]="myMax">');
		expect(content).toContain('<hlm-date-range-picker [minDate]="rangeStart" [maxDate]="rangeEnd" />');
		expect(content).toContain('<hlm-month-year-picker [minDate]="yearMin" [maxDate]="yearMax" />');
	});

	it('should not rename on hlm-calendar, native input, hlm-date-picker-input, or attr bindings', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<hlm-calendar [min]="minDate" [max]="maxDate" />
				<input min="2024-01-01" max="2024-12-31" />
				<hlm-date-picker-input [min]="pickerMin" [max]="pickerMax" />
				<hlm-date-picker-trigger [min]="triggerMin" />
				<label for="min">Minimum</label>
			`,
		);

		await migrateDatePickerMinMaxGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<hlm-calendar [min]="minDate" [max]="maxDate" />');
		expect(content).toContain('<input min="2024-01-01" max="2024-12-31" />');
		expect(content).toContain('<hlm-date-picker-input [min]="pickerMin" [max]="pickerMax" />');
		expect(content).toContain('<hlm-date-picker-trigger [min]="triggerMin" />');
		expect(content).toContain('<label for="min">Minimum</label>');
	});

	it('should rename min and max on multi-line tags (attributes on separate lines)', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<hlm-date-picker
					[min]="myMin()"
					[max]="myMax()"
					class="w-full"
				></hlm-date-picker>
				<hlm-date-picker-multi
					min="2024-01-01"
					max="2024-12-31"
				/>
			`,
		);

		await migrateDatePickerMinMaxGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<hlm-date-picker\n\t\t\t\t\t[minDate]="myMin()"\n\t\t\t\t\t[maxDate]="myMax()"');
		expect(content).toContain('<hlm-date-picker-multi\n\t\t\t\t\tminDate="2024-01-01"\n\t\t\t\t\tmaxDate="2024-12-31"');
	});

	it('should not rename already-migrated minDate and maxDate inputs', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<hlm-date-picker minDate="2024-01-01" maxDate="2024-12-31" />
			`,
		);

		await migrateDatePickerMinMaxGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<hlm-date-picker minDate="2024-01-01" maxDate="2024-12-31" />');
	});
});
