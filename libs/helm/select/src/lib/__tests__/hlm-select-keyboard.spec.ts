import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { fireEvent, render } from '@testing-library/angular';
import { HlmSelectImports } from '../../index';

// Lets afterNextRender (overlay open + keyManager active-item effect) and microtasks settle.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-select-keyboard-host',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select class="w-56">
			<hlm-select-trigger>
				<hlm-select-value placeholder="Select a fruit" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-item value="apple">Apple</hlm-select-item>
				<hlm-select-item value="banana">Banana</hlm-select-item>
			</hlm-select-content>
		</hlm-select>
	`,
})
class SelectKeyboardHost {}

@Component({
	selector: 'hlm-select-multiple-keyboard-host',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select-multiple [(value)]="selected">
			<hlm-select-trigger class="w-56">
				<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-item value="apple">Apple</hlm-select-item>
				<hlm-select-item value="banana">Banana</hlm-select-item>
			</hlm-select-content>
		</hlm-select-multiple>
	`,
})
class SelectMultipleKeyboardHost {
	public readonly selected = signal<string[] | null>(null);
}

@Component({
	selector: 'hlm-select-disabled-keyboard-host',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select [(value)]="value" class="w-56">
			<hlm-select-trigger>
				<hlm-select-value placeholder="Select a fruit" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-item value="locked" disabled>Locked</hlm-select-item>
				<hlm-select-item value="open">Open</hlm-select-item>
			</hlm-select-content>
		</hlm-select>
	`,
})
class SelectDisabledKeyboardHost {
	public readonly value = signal<string | null>('locked');
}

@Component({
	selector: 'hlm-select-multiple-disabled-keyboard-host',
	imports: [HlmSelectImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-select-multiple [(value)]="selected">
			<hlm-select-trigger class="w-56">
				<hlm-select-placeholder>Select fruits</hlm-select-placeholder>
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-item value="anna" disabled>Anna</hlm-select-item>
				<hlm-select-item value="ben">Ben</hlm-select-item>
			</hlm-select-content>
		</hlm-select-multiple>
	`,
})
class SelectMultipleDisabledKeyboardHost {
	public readonly selected = signal<string[] | null>(['anna']);
}

describe('HlmSelect keyboard', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	const trigger = () => document.querySelector('button[brnselecttrigger]') as HTMLButtonElement;
	const listboxOpen = () => trigger().getAttribute('aria-expanded') === 'true';

	it('opens on ArrowDown', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();

		expect(listboxOpen()).toBe(true);
		expect(document.querySelector('[role="listbox"]')).toBeTruthy();
	});

	it('links the trigger to the listbox via aria-controls while expanded', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();

		const listbox = document.querySelector('[role="listbox"]') as HTMLElement;
		expect(listbox.id).toBeTruthy();
		expect(trigger()).toHaveAttribute('aria-controls', listbox.id);
	});

	it('omits aria-controls while collapsed', async () => {
		await render(SelectKeyboardHost);

		expect(trigger()).not.toHaveAttribute('aria-controls');
	});

	// Regression: committing a value with Enter must close the panel. Previously the trigger re-read
	// its expanded state after the (synchronous) close and re-opened the overlay on the same keypress.
	it('commits the active value and closes on Enter', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);

		fireEvent.keyDown(trigger(), { key: 'Enter' });
		view.detectChanges();
		await flush();

		expect(listboxOpen()).toBe(false);
		expect(document.querySelector('[role="listbox"]')).toBeNull();
		// a value was committed (placeholder no longer the only content)
		expect(trigger().textContent?.toLowerCase()).toContain('apple');
	});

	// Regression: Space must behave like Enter (APG select-only combobox), committing the
	// active option instead of leaking the keystroke to type-ahead and closing via the native
	// button activation.
	it('commits the active value and closes on Space', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);

		fireEvent.keyDown(trigger(), { key: ' ' });
		view.detectChanges();
		await flush();

		expect(listboxOpen()).toBe(false);
		expect(document.querySelector('[role="listbox"]')).toBeNull();
		expect(trigger().textContent?.toLowerCase()).toContain('apple');
	});

	// Tab moves focus on to the next control and dismisses the panel without committing.
	it('closes without committing on Tab', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);

		fireEvent.keyDown(trigger(), { key: 'Tab' });
		view.detectChanges();
		await flush();

		expect(listboxOpen()).toBe(false);
		expect(document.querySelector('[role="listbox"]')).toBeNull();
		// the highlighted option was not committed
		expect(trigger().textContent?.toLowerCase()).toContain('select a fruit');
	});

	it('closes on Escape without committing', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);

		fireEvent.keyDown(trigger(), { key: 'Escape' });
		view.detectChanges();
		await flush();

		expect(listboxOpen()).toBe(false);
		expect(document.querySelector('[role="listbox"]')).toBeNull();
		expect(trigger().textContent?.toLowerCase()).toContain('select a fruit');
	});

	it('keeps focus on the trigger while navigating (aria-activedescendant model)', async () => {
		const view = await render(SelectKeyboardHost);
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();

		// autoFocus must not pull focus into the listbox (it has no tabbable element).
		expect(document.activeElement).toBe(trigger());
	});

	// In a multiple select, Space toggles the focused option and keeps the listbox open,
	// matching the APG multi-select listbox behaviour.
	it('toggles the active value on Space without closing when multiple', async () => {
		const view = await render(SelectMultipleKeyboardHost);
		const host = view.fixture.componentInstance;
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);

		fireEvent.keyDown(trigger(), { key: ' ' });
		view.detectChanges();
		await flush();

		expect(host.selected()).toEqual(['apple']);
		expect(listboxOpen()).toBe(true);
	});

	// Regression (#1748): Tab must not toggle the highlighted option in a multiple select; it
	// leaves the control. The panel must not be left open with nothing focused inside it.
	it('closes without toggling on Tab when multiple', async () => {
		const view = await render(SelectMultipleKeyboardHost);
		const host = view.fixture.componentInstance;
		trigger().focus();

		fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);

		fireEvent.keyDown(trigger(), { key: 'Tab' });
		view.detectChanges();
		await flush();

		expect(listboxOpen()).toBe(false);
		expect(document.querySelector('[role="listbox"]')).toBeNull();
		expect(host.selected()).toBeNull();
	});

	// Regression (#1747): a disabled option can be the active item because the on-open effect
	// highlights the option matching the current value, and setActiveItem ignores skipPredicate.
	// Committing it must be a no-op.
	it('does not commit a disabled active option on Enter', async () => {
		const view = await render(SelectDisabledKeyboardHost);
		const host = view.fixture.componentInstance;
		trigger().focus();

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);
		expect(document.querySelector('[data-highlighted]')?.getAttribute('data-value')).toBe('locked');

		fireEvent.keyDown(trigger(), { key: 'Enter' });
		view.detectChanges();
		await flush();

		expect(host.value()).toBe('locked');
		expect(listboxOpen()).toBe(true);
	});

	it('does not toggle a disabled active option on Enter when multiple', async () => {
		const view = await render(SelectMultipleDisabledKeyboardHost);
		const host = view.fixture.componentInstance;
		trigger().focus();

		fireEvent.click(trigger());
		view.detectChanges();
		await flush();
		expect(listboxOpen()).toBe(true);
		expect(document.querySelector('[data-highlighted]')?.getAttribute('data-value')).toBe('anna');

		fireEvent.keyDown(trigger(), { key: 'Enter' });
		view.detectChanges();
		await flush();

		expect(host.selected()).toEqual(['anna']);
		expect(listboxOpen()).toBe(true);
	});
});
