import { ChangeDetectionStrategy, Component } from '@angular/core';
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
});
