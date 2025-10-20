import { applicationGenerator, E2eTestRunner, UnitTestRunner } from '@nx/angular/generators';
import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import migrateAccordionTriggerGenerator from './generator';

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

describe('migrate-accordion-trigger generator', () => {
	let tree: Tree;
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(async () => {
		tree = createTreeWithEmptyWorkspace();
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

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

	afterEach(() => {
		consoleLogSpy.mockRestore();
	});

	it('should wrap button with hlmAccordionTrigger in h3', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<div>
	<button hlmAccordionTrigger>
		Is it accessible?
		<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
	</button>
</div>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain(`<h3 class="contents">`);
		expect(content).toContain(`<button hlmAccordionTrigger>`);
		expect(content).toContain(`</h3>`);
		expect(content).toContain(`<ng-icon name="lucideChevronDown" hlm hlmAccIcon />`);
	});

	it('should wrap button with brnAccordionTrigger in h3', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<div>
	<button brnAccordionTrigger>
		Is it accessible?
	</button>
</div>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain(`<h3 class="contents">`);
		expect(content).toContain(`<button brnAccordionTrigger>`);
		expect(content).toContain(`</h3>`);
	});

	it('should handle multiple triggers in the same file', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<div>
	<button hlmAccordionTrigger>First trigger</button>
	<div>Some content</div>
	<button brnAccordionTrigger>Second trigger</button>
</div>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		// Both buttons should be wrapped
		expect((content.match(/<h3 class="contents">/g) || []).length).toBe(2);
		expect(content).toContain(`<button hlmAccordionTrigger>First trigger</button>`);
		expect(content).toContain(`<button brnAccordionTrigger>Second trigger</button>`);
	});

	it('should handle inline templates in TypeScript files', async () => {
		tree.write(
			'app/src/app/app.component.ts',
			`import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	template: \`
		<div>
			<button hlmAccordionTrigger>
				Is it accessible?
				<ng-icon name="lucideChevronDown" hlm hlmAccIcon />
			</button>
		</div>
	\`
})
export class AppComponent {}`,
		);

		console.log('los gehts');

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.ts', 'utf-8');
		expect(content).toContain(`<h3 class="contents">`);
		expect(content).toContain(`<button hlmAccordionTrigger>`);
		expect(content).toContain(`</h3>`);
	});

	it('should not wrap buttons that are already in a heading', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<div>
	<h3 class="contents">
		<button hlmAccordionTrigger>Already wrapped</button>
	</h3>
	<h4>
		<button brnAccordionTrigger>Also wrapped</button>
	</h4>
</div>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		// Should not add another h3 wrapper - still only 1 h3 and 1 h4
		expect((content.match(/<h3 class="contents">/g) || []).length).toBe(1);
		expect((content.match(/<h4>/g) || []).length).toBe(1);
		expect(content).not.toContain(`<h3 class="contents">\n\t<h3 class="contents">`); // No nested headings
	});

	it('should log a warning when button in heading has siblings', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<h3 class="contents">
	Some text before
	<button hlmAccordionTrigger>Button</button>
	Some text after
</h3>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		// Content should not be modified
		expect(content).toContain(`Some text before`);
		expect(content).toContain(`Some text after`);

		// Should have logged a warning
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('1 accordion trigger buttons that have siblings that need to be manually moved'),
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('app/src/app/app.component.html'));
		expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('has siblings'));
	});

	it('should handle buttons with multiple attributes', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<button
	hlmAccordionTrigger
	class="w-full"
	[disabled]="isDisabled"
	(click)="handleClick()">
	Complex button
</button>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		expect(content).toContain(`<h3 class="contents">`);
		expect(content).toContain(`hlmAccordionTrigger`);
		expect(content).toContain(`class="w-full"`);
		expect(content).toContain(`[disabled]="isDisabled"`);
		expect(content).toContain(`(click)="handleClick()"`);
		expect(content).toContain(`</h3>`);
	});

	it('should handle buttons already in correct structure (h1-h6 with no siblings)', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<div>
	<h1><button hlmAccordionTrigger>In h1</button></h1>
	<h2><button brnAccordionTrigger>In h2</button></h2>
	<h5><button hlmAccordionTrigger>In h5</button></h5>
	<h6><button brnAccordionTrigger>In h6</button></h6>
</div>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');
		// Should not add any h3 tags since buttons are already properly wrapped
		expect(content).not.toContain(`<h3 class="contents">`);
		// Original headings should remain
		expect(content).toContain(`<h1><button hlmAccordionTrigger>In h1</button></h1>`);
		expect(content).toContain(`<h2><button brnAccordionTrigger>In h2</button></h2>`);
		expect(content).toContain(`<h5><button hlmAccordionTrigger>In h5</button></h5>`);
		expect(content).toContain(`<h6><button brnAccordionTrigger>In h6</button></h6>`);

		// No warnings should be logged
		expect(consoleLogSpy).not.toHaveBeenCalledWith(
			expect.stringContaining('1 accordion trigger buttons that have siblings that need to be manually moved'),
		);
	});

	it('should handle mixed scenarios in one file', async () => {
		tree.write(
			'app/src/app/app.component.html',
			`<div>
	<!-- Needs wrapping -->
	<button hlmAccordionTrigger>Unwrapped</button>

	<!-- Already correct -->
	<h3 class="contents"><button brnAccordionTrigger>Correctly wrapped</button></h3>

	<!-- Needs manual fix -->
	<h4>
		Text before
		<button hlmAccordionTrigger>Has siblings</button>
		Text after
	</h4>
</div>`,
		);

		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });

		const content = tree.read('app/src/app/app.component.html', 'utf-8');

		// First button should be wrapped
		expect((content.match(/<h3 class="contents">/g) || []).length).toBe(2); // Original + new wrapper

		// Second button should remain unchanged
		expect(content).toContain(`<h3 class="contents"><button brnAccordionTrigger>Correctly wrapped</button></h3>`);

		// Third button should trigger warning but not be modified
		expect(content).toContain(`Text before`);
		expect(content).toContain(`Text after`);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('1 accordion trigger buttons that have siblings that need to be manually moved'),
		);
	});
});
