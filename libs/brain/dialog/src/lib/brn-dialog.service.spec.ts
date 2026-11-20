import { ApplicationRef, ChangeDetectionStrategy, Component } from '@angular/core';
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

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button id="first">first</button>
		<button id="last">last</button>
	`,
})
class FocusableDialogContent {}

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** Waits for the dialog to render and for the frame that clears `data-starting-style`. */
async function settle(): Promise<void> {
	await TestBed.inject(ApplicationRef).whenStable();
	await nextFrame();
	await nextFrame();
}

function pane(): HTMLElement {
	return document.querySelector<HTMLElement>('.cdk-overlay-pane')!;
}

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

	it('renders data-starting-style for the first frame only', async () => {
		const dialog = TestBed.inject(BrnDialogService).open(DialogContent);

		expect(dialog.transitionStatus()).toBe('starting');
		expect(pane().hasAttribute('data-starting-style')).toBe(true);
		expect(backdrops()[0].hasAttribute('data-starting-style')).toBe(true);

		await settle();

		expect(dialog.transitionStatus()).toBeUndefined();
		expect(pane().hasAttribute('data-starting-style')).toBe(false);
	});

	it('renders data-ending-style while closing and clears it on reopen', async () => {
		const dialog = TestBed.inject(BrnDialogService).open(DialogContent);
		await settle();

		dialog.close();
		expect(dialog.transitionStatus()).toBe('ending');
		expect(pane().hasAttribute('data-ending-style')).toBe(true);

		dialog.reopen();
		expect(dialog.transitionStatus()).toBeUndefined();
		expect(pane().hasAttribute('data-ending-style')).toBe(false);
	});

	it('emits openChangeComplete after opening and after closing', async () => {
		const dialog = TestBed.inject(BrnDialogService).open(DialogContent);
		const events: boolean[] = [];
		dialog.openChangeComplete$.subscribe((open) => events.push(open));

		await settle();
		expect(events).toEqual([true]);

		dialog.close();
		await settle();
		expect(events).toEqual([true, false]);
		expect(dialog.phase()).toBe('closed');
	});

	it('keeps Tab inside the dialog by default', async () => {
		TestBed.inject(BrnDialogService).open(FocusableDialogContent);
		await settle();

		expect(document.querySelectorAll('.cdk-focus-trap-anchor[tabindex="0"]').length).toBe(2);
	});

	it('lets Tab leave the dialog when trapFocus is false, still moving focus in', async () => {
		TestBed.inject(BrnDialogService).open(FocusableDialogContent, undefined, undefined, { trapFocus: false });
		await settle();

		expect(document.querySelectorAll('.cdk-focus-trap-anchor[tabindex="0"]').length).toBe(0);
		expect(document.activeElement?.id).toBe('first');
	});

	it('closes on focus out only when closeOnFocusOut is set', async () => {
		const outside = document.body.appendChild(document.createElement('button'));
		const service = TestBed.inject(BrnDialogService);
		const kept = service.open(FocusableDialogContent);
		await settle();
		outside.focus();
		expect(kept.state()).toBe('open');
		kept.forceClose();

		const dismissed = service.open(FocusableDialogContent, undefined, undefined, {
			closeOnFocusOut: true,
			trapFocus: false,
		});
		await settle();
		outside.focus();
		expect(dismissed.state()).toBe('closed');

		outside.remove();
	});
});
