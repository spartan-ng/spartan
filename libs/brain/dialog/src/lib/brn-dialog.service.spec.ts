import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fireEvent } from '@testing-library/angular';
import { BrnDialogService } from './brn-dialog.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p>Dialog content</p>
	`,
})
class DialogContent {}

/** CDK's outside-click dispatcher records the target on `pointerdown` and emits on the following `click`. */
const pointerClick = (target: Element) => {
	fireEvent.pointerDown(target);
	fireEvent.click(target);
};

/** Dispatches Escape from inside the top overlay pane; `handled` marks it as consumed by an inner element first. */
const pressEscape = (handled = false) => {
	const pane = Array.from(document.querySelectorAll<HTMLElement>('.cdk-overlay-pane')).at(-1)!;
	if (handled) pane.addEventListener('keydown', (event) => event.preventDefault(), { once: true });
	const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
	pane.dispatchEvent(event);
	return event;
};

function backdrops(): HTMLElement[] {
	return Array.from(document.querySelectorAll<HTMLElement>('.cdk-overlay-backdrop'));
}

describe('BrnDialogService', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('closes a dialog when its backdrop is clicked', () => {
		const dialog = TestBed.inject(BrnDialogService).open(DialogContent);

		pointerClick(backdrops()[0]);

		expect(dialog.state()).toBe('closed');
	});

	it('closes only the top dialog when the backdrop of a stacked dialog is clicked', () => {
		const service = TestBed.inject(BrnDialogService);
		const below = service.open(DialogContent);
		const above = service.open(DialogContent);

		pointerClick(backdrops()[1]);

		expect(above.state()).toBe('closed');
		expect(below.state()).toBe('open');
	});

	it('closes a dialog on Escape and marks the event as handled', () => {
		const dialog = TestBed.inject(BrnDialogService).open(DialogContent);

		const event = pressEscape();

		expect(dialog.state()).toBe('closed');
		expect(event.defaultPrevented).toBe(true);
	});

	it('stays open on an Escape that was already handled inside it', () => {
		const dialog = TestBed.inject(BrnDialogService).open(DialogContent);

		pressEscape(true);

		expect(dialog.state()).toBe('open');
	});
});
