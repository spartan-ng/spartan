import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateInputIdGenerator } from './generator';

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

describe('migrate-input-id generator', () => {
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

	it('should rename static id inputs on supported helm components in html templates', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<hlm-checkbox id="checkbox-id" />
				<hlm-switch id="switch-id"></hlm-switch>
				<hlm-radio id="radio-id" value="monthly"></hlm-radio>
				<hlm-command-input id="command-id" placeholder="Search" />
			`,
		);

		await migrateInputIdGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<hlm-checkbox inputId="checkbox-id" />');
		expect(content).toContain('<hlm-switch inputId="switch-id"></hlm-switch>');
		expect(content).toContain('<hlm-radio inputId="radio-id" value="monthly"></hlm-radio>');
		expect(content).toContain('<hlm-command-input inputId="command-id" placeholder="Search" />');
		expect(content).not.toContain(' id=');
	});

	it('should rename bound [id] and bind-id inputs in inline templates', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`
				import { Component } from '@angular/core';

				@Component({
					template: \`
						<hlm-checkbox [id]="checkboxId()" />
						<hlm-switch bind-id="switchId" />
						<hlm-radio [id]="radioId" value="yearly"></hlm-radio>
						<hlm-command-input [id]="commandId" />
					\`,
				})
				export class AppComponent {}
			`,
		);

		await migrateInputIdGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain('<hlm-checkbox [inputId]="checkboxId()" />');
		expect(content).toContain('<hlm-switch bind-inputId="switchId" />');
		expect(content).toContain('<hlm-radio [inputId]="radioId" value="yearly"></hlm-radio>');
		expect(content).toContain('<hlm-command-input [inputId]="commandId" />');
	});

	it('should not rename native elements, unrelated components, or attr bindings', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`
				<input id="native-input" />
				<hlm-combobox-input id="combobox-input" />
				<hlm-checkbox [attr.id]="checkboxAttrId" />
				<label for="terms">Terms</label>
				<hlm-command-input inputId="search" aria-labelledby="search-label" />
			`,
		);

		await migrateInputIdGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain('<input id="native-input" />');
		expect(content).toContain('<hlm-combobox-input id="combobox-input" />');
		expect(content).toContain('<hlm-checkbox [attr.id]="checkboxAttrId" />');
		expect(content).toContain('<label for="terms">Terms</label>');
		expect(content).toContain('<hlm-command-input inputId="search" aria-labelledby="search-label" />');
	});
});
