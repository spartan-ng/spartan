import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { fireEvent, render } from '@testing-library/angular';
import { HlmSelectImports } from '../../index';

// Lets afterNextRender (overlay open + keyManager active-item effect) and microtasks settle.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-select-all-host',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select-multiple [(value)]="value" class="w-56">
			<hlm-select-trigger>
				<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-all>Select all</hlm-select-all>
				<hlm-select-item value="apple">Apple</hlm-select-item>
				<hlm-select-item value="banana">Banana</hlm-select-item>
				<hlm-select-item value="cherry" disabled>Cherry</hlm-select-item>
			</hlm-select-content>
		</hlm-select-multiple>
	`,
})
class SelectAllHost {
	public readonly value = model<string[] | undefined | null>(null);
}

@Component({
	selector: 'hlm-select-all-form-host',
	imports: [HlmSelectImports, ReactiveFormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select-multiple [formControl]="fruits" class="w-56">
			<hlm-select-trigger>
				<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-all>Select all</hlm-select-all>
				<hlm-select-item value="apple">Apple</hlm-select-item>
				<hlm-select-item value="banana">Banana</hlm-select-item>
			</hlm-select-content>
		</hlm-select-multiple>
	`,
})
class SelectAllFormHost {
	public readonly fruits = new FormControl<string[]>([]);
}

@Component({
	selector: 'hlm-select-all-single-host',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select [(value)]="value" class="w-56">
			<hlm-select-trigger>
				<hlm-select-value placeholder="Select a fruit" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-all>Select all</hlm-select-all>
				<hlm-select-item value="apple">Apple</hlm-select-item>
				<hlm-select-item value="banana">Banana</hlm-select-item>
			</hlm-select-content>
		</hlm-select>
	`,
})
class SelectAllSingleHost {
	public readonly value = model<string | undefined | null>(null);
}

describe('HlmSelectAll', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	const trigger = () => document.querySelector('button[brnselecttrigger]') as HTMLButtonElement;
	const listbox = () => document.querySelector('[role="listbox"]');
	const selectAllRow = () => document.querySelector('hlm-select-all') as HTMLElement;
	const indicator = () => selectAllRow()?.querySelector('.spartan-select-item-indicator');

	const open = async (view: { detectChanges: () => void }) => {
		trigger().focus();
		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
	};

	it('renders as an option inside a multiselectable listbox', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		expect(listbox()?.getAttribute('aria-multiselectable')).toBe('true');
		expect(selectAllRow().getAttribute('role')).toBe('option');
		expect(selectAllRow().getAttribute('aria-selected')).toBe('false');
		expect(selectAllRow().getAttribute('data-state')).toBe('unchecked');
	});

	it('selects all enabled items on click and keeps the panel open', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		fireEvent.click(selectAllRow());
		view.detectChanges();
		await flush();

		expect(view.fixture.componentInstance.value()).toEqual(['apple', 'banana']);
		expect(listbox()).toBeTruthy();
		expect(selectAllRow().getAttribute('aria-selected')).toBe('true');
		expect(selectAllRow().getAttribute('data-state')).toBe('checked');
		expect(indicator()).toBeTruthy();
	});

	it('deselects all items on a second click', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		fireEvent.click(selectAllRow());
		view.detectChanges();
		fireEvent.click(selectAllRow());
		view.detectChanges();
		await flush();

		expect(view.fixture.componentInstance.value()).toEqual([]);
		expect(selectAllRow().getAttribute('data-state')).toBe('unchecked');
		expect(indicator()).toBeNull();
	});

	it('does not select disabled items', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		fireEvent.click(selectAllRow());
		view.detectChanges();
		await flush();

		expect(view.fixture.componentInstance.value()).not.toContain('cherry');
	});

	it('toggles all with Enter without closing the panel', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		// with no value the first item (the select-all row) is active
		fireEvent.keyDown(trigger(), { key: 'Enter' });
		view.detectChanges();
		await flush();

		expect(view.fixture.componentInstance.value()).toEqual(['apple', 'banana']);
		expect(listbox()).toBeTruthy();
	});

	it('keeps the select-all row active so a second Enter clears the selection', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		for (let i = 0; i < 2; i++) {
			fireEvent.keyDown(trigger(), { key: 'Enter' });
			view.detectChanges();
			await flush();
		}

		expect(trigger().getAttribute('aria-activedescendant')).toBe(selectAllRow().id);
		expect(view.fixture.componentInstance.value()).toEqual([]);
	});

	it('shows the indeterminate state after deselecting a single item', async () => {
		const view = await render(SelectAllHost);
		await open(view);

		fireEvent.click(selectAllRow());
		view.detectChanges();
		const banana = document.querySelector('hlm-select-item[value="banana"]') as HTMLElement;
		fireEvent.click(banana);
		view.detectChanges();
		await flush();

		expect(view.fixture.componentInstance.value()).toEqual(['apple']);
		expect(selectAllRow().getAttribute('data-state')).toBe('indeterminate');
		expect(selectAllRow().getAttribute('aria-selected')).toBe('false');
		expect(indicator()).toBeNull();
	});

	it('emits the full value array once on a bound form control', async () => {
		const view = await render(SelectAllFormHost);
		const control = view.fixture.componentInstance.fruits;
		const emissions: (string[] | null)[] = [];
		control.valueChanges.subscribe((value) => emissions.push(value));
		await open(view);

		fireEvent.click(selectAllRow());
		view.detectChanges();
		await flush();

		expect(emissions).toEqual([['apple', 'banana']]);
	});

	describe('inside a single select', () => {
		it('is disabled, skipped by keyboard navigation and inert on click', async () => {
			const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
			const view = await render(SelectAllSingleHost);
			await open(view);

			expect(selectAllRow().getAttribute('aria-disabled')).toBe('true');
			// the key manager skips the disabled row - the first real item is active instead
			expect(selectAllRow().hasAttribute('data-highlighted')).toBe(false);
			expect(document.querySelector('hlm-select-item[value="apple"]')?.hasAttribute('data-highlighted')).toBe(true);

			fireEvent.click(selectAllRow());
			view.detectChanges();
			await flush();

			expect(view.fixture.componentInstance.value()).toBeNull();
			expect(warn).toHaveBeenCalled();
			warn.mockRestore();
		});

		it('does not mark the listbox as multiselectable', async () => {
			vi.spyOn(console, 'warn').mockImplementation(() => undefined);
			const view = await render(SelectAllSingleHost);
			await open(view);

			expect(listbox()?.hasAttribute('aria-multiselectable')).toBe(false);
		});
	});
});
