import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { migrateNativeHostElements, migrateNativeHostElementsGenerator } from './generator';

describe('migrate-native-host-elements generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should migrate the trigger wrappers to native buttons', () => {
		const result = migrateNativeHostElements(`
			<hlm-combobox-trigger buttonId="countries" class="w-64"><hlm-combobox-value /></hlm-combobox-trigger>
			<hlm-select-trigger size="sm" [class]="cls"><hlm-select-value /></hlm-select-trigger>
			<hlm-date-picker-trigger forceInvalid>Pick a date</hlm-date-picker-trigger>
		`);

		expect(result).toContain(
			'<button hlmComboboxTrigger buttonId="countries" class="w-64"><hlm-combobox-value /></button>',
		);
		expect(result).toContain('<button hlmSelectTrigger size="sm" [class]="cls"><hlm-select-value /></button>');
		expect(result).toContain('<button hlmDatePickerTrigger forceInvalid>Pick a date</button>');
	});

	it('should migrate self-closing pagination links to anchors', () => {
		const result = migrateNativeHostElements(`
			<hlm-pagination-previous link="." [queryParams]="{ page: page() - 1 }" />
			<hlm-pagination-next iconOnly link="."></hlm-pagination-next>
		`);

		expect(result).toContain('<a hlmPaginationPrevious link="." [queryParams]="{ page: page() - 1 }"></a>');
		expect(result).toContain('<a hlmPaginationNext iconOnly link="."></a>');
	});

	it('should migrate pagination links without a link to buttons', () => {
		const result = migrateNativeHostElements(`
			<hlm-pagination-previous [text]="label" (click)="goToPrevious()" />
			<hlm-pagination-next (click)="goToNext()"></hlm-pagination-next>
			el.querySelector('hlm-pagination-next button');
		`);

		expect(result).toContain(
			'<button type="button" hlmPaginationPrevious [text]="label" (click)="goToPrevious()"></button>',
		);
		expect(result).toContain('<button type="button" hlmPaginationNext (click)="goToNext()"></button>');
		expect(result).toContain(`el.querySelector('[hlmPaginationNext]')`);
	});

	it('should keep multi-line attribute layouts and handle ">" inside bindings', () => {
		const result = migrateNativeHostElements(`
			<hlm-select-trigger
				class="w-56"
				[forceInvalid]="count() > 2"
			>
				<hlm-select-value />
			</hlm-select-trigger>
		`);

		expect(result).toContain(`<button
				hlmSelectTrigger
				class="w-56"
				[forceInvalid]="count() > 2"
			>
				<hlm-select-value />
			</button>`);
	});

	it('should migrate selectors that targeted the inner native element', () => {
		const result = migrateNativeHostElements(`
			fixture.nativeElement.querySelector('hlm-select-trigger > button');
			cy.get('hlm-combobox-trigger button').click();
			el.querySelector("hlm-pagination-next a");
			<div class="[&>hlm-select>hlm-select-trigger>button]:rounded-r-none"></div>
		`);

		expect(result).toContain(`querySelector('[hlmSelectTrigger]')`);
		expect(result).toContain(`cy.get('[hlmComboboxTrigger]')`);
		expect(result).toContain(`querySelector("[hlmPaginationNext]")`);
		expect(result).toContain('[&>hlm-select>[hlmSelectTrigger]]:rounded-r-none');
	});

	it('should migrate selectors that targeted the wrapper element', () => {
		const result = migrateNativeHostElements(`
			cy.get('hlm-select-trigger').click();
			fixture.nativeElement.querySelector("hlm-select hlm-combobox-trigger");
			el.querySelectorAll('hlm-pagination-next:not([disabled]), hlm-date-picker-trigger');
		`);

		expect(result).toContain(`cy.get('[hlmSelectTrigger]')`);
		expect(result).toContain(`querySelector("hlm-select [hlmComboboxTrigger]")`);
		expect(result).toContain(`querySelectorAll('[hlmPaginationNext]:not([disabled]), [hlmDatePickerTrigger]')`);
	});

	it('should migrate pagination actions with content to buttons', () => {
		const result = migrateNativeHostElements(`
			<hlm-pagination-next (click)="advance()"><!-- next page --></hlm-pagination-next>
			<hlm-pagination-previous link="/prev">
				<span>Back</span>
			</hlm-pagination-previous>
		`);

		expect(result).toContain('<button type="button" hlmPaginationNext (click)="advance()"><!-- next page --></button>');
		expect(result).toContain(`<a hlmPaginationPrevious link="/prev">
				<span>Back</span>
			</a>`);
	});

	it('should keep a self-closing slash out of unquoted attribute values', () => {
		const result = migrateNativeHostElements(`
			<hlm-select-trigger class=compact/>
			<hlm-pagination-next class=compact/>
			<hlm-pagination-previous link=/products />
		`);

		expect(result).toContain('<button hlmSelectTrigger class=compact></button>');
		expect(result).toContain('<button type="button" hlmPaginationNext class=compact></button>');
		expect(result).toContain('<a hlmPaginationPrevious link=/products></a>');
	});

	it('should migrate inline templates with escaped quotes', () => {
		const result = migrateNativeHostElements(
			`@Component({ template: "<hlm-select-trigger aria-label=\\"Choose\\">Value</hlm-select-trigger>" })`,
		);

		expect(result).toContain(`template: "<button hlmSelectTrigger aria-label=\\"Choose\\">Value</button>"`);
	});

	it('should not replace closing tags of opening tags that could not be migrated', () => {
		const source = `<hlm-select-trigger class="w-56" "invalid">Value</hlm-select-trigger>`;

		expect(migrateNativeHostElements(source)).toBe(source);
	});

	it('should ignore legacy tags inside HTML comments when pairing opening and closing tags', () => {
		const result = migrateNativeHostElements(`
			<hlm-select-trigger class="w-56">
				<!-- </hlm-select-trigger> -->
				<hlm-select-value />
			</hlm-select-trigger>
			<!-- <hlm-select-trigger>Old</hlm-select-trigger> -->
			<hlm-select-trigger><hlm-select-value /></hlm-select-trigger>
		`);

		expect(result).toContain(`<button hlmSelectTrigger class="w-56">
				<!-- </hlm-select-trigger> -->
				<hlm-select-value />
			</button>`);
		expect(result).toContain('<!-- <hlm-select-trigger>Old</hlm-select-trigger> -->');
		expect(result).toContain('<button hlmSelectTrigger><hlm-select-value /></button>');
	});

	it('should rename the select trigger buttonId input to id', () => {
		const result = migrateNativeHostElements(`
			<hlm-select-trigger buttonId="fruit" class="w-56"><hlm-select-value /></hlm-select-trigger>
			<hlm-select-trigger [buttonId]="triggerId" aria-label="buttonId"><hlm-select-value /></hlm-select-trigger>
			<hlm-combobox-trigger buttonId="countries"><hlm-combobox-value /></hlm-combobox-trigger>
		`);

		expect(result).toContain('<button hlmSelectTrigger id="fruit" class="w-56"><hlm-select-value /></button>');
		expect(result).toContain(
			'<button hlmSelectTrigger [id]="triggerId" aria-label="buttonId"><hlm-select-value /></button>',
		);
		expect(result).toContain('<button hlmComboboxTrigger buttonId="countries"><hlm-combobox-value /></button>');
	});

	it('should flag [class] arrays containing class maps for manual conversion', () => {
		const result = migrateNativeHostElements(`
			<hlm-select-trigger [class]="['w-64', { 'w-full': expanded }]"><hlm-select-value /></hlm-select-trigger>
			<hlm-combobox-trigger [class]="{ 'w-full': expanded }" />
		`);

		expect(result).toContain(`<!-- TODO(spartan): [class] no longer supports class maps inside arrays`);
		expect(result).toContain(
			`<button hlmSelectTrigger [class]="['w-64', { 'w-full': expanded }]"><hlm-select-value /></button>`,
		);
		expect(result.match(/TODO\(spartan\)/g)).toHaveLength(1);
	});

	it('should not touch imports, similar selectors or prose', () => {
		const source = `
			import { HlmSelectTrigger } from './lib/hlm-select-trigger';
			<hlm-select-trigger-custom />
			<p>Use hlm-pagination-next a lot</p>
		`;

		expect(migrateNativeHostElements(source)).toBe(source);
	});

	it('should update html and inline templates in the workspace', async () => {
		tree.write('app/src/app/app.component.html', '<hlm-select-trigger><hlm-select-value /></hlm-select-trigger>');
		tree.write(
			'app/src/app/app.component.ts',
			'@Component({ template: \'<hlm-pagination-next link="/next" />\' }) export class AppComponent {}',
		);

		await migrateNativeHostElementsGenerator(tree, { skipFormat: true });

		expect(tree.read('app/src/app/app.component.html', 'utf-8')).toBe(
			'<button hlmSelectTrigger><hlm-select-value /></button>',
		);
		expect(tree.read('app/src/app/app.component.ts', 'utf-8')).toContain('<a hlmPaginationNext link="/next"></a>');
	});
});
