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
