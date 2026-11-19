/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrnTooltip } from './brn-tooltip';

@Component({
	imports: [BrnTooltip],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button brnTooltip="Tooltip">Trigger</button>
	`,
})
class TooltipHost {}

const pointer = (target: Element, type: 'pointerenter' | 'pointerleave') =>
	target.dispatchEvent(new PointerEvent(type, { pointerType: 'mouse' }));

const trace: string[] = [];
(globalThis as any).__tt = trace;
const raf = () => {
	trace.push(`${performance.now().toFixed(0)} raf vis=${document.visibilityState} focus=${document.hasFocus()}`);
};
const waitFor = async (fn: () => void) => {
	const t0 = performance.now();
	try {
		await vi.waitFor(fn);
	} catch (e) {
		raf();
		throw new Error(
			`waited ${(performance.now() - t0).toFixed(0)}ms\n${(e as Error).message}\nTRACE:\n${trace.join('\n')}`,
		);
	}
};

describe('BrnTooltip', () => {
	beforeEach(() => {
		trace.length = 0;
		raf();
	});
	afterEach(() => {
		TestBed.resetTestingModule();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('still hides on trigger leave after the content was hovered while closing', async () => {
		const fixture = TestBed.createComponent(TooltipHost);
		await fixture.whenStable();
		const trigger: HTMLElement = fixture.nativeElement.querySelector('button');
		const brnTooltip = fixture.debugElement.query(By.directive(BrnTooltip)).injector.get(BrnTooltip);
		const tooltip = () => document.querySelector('[role="tooltip"]');

		pointer(trigger, 'pointerenter');
		await waitFor(() => expect(tooltip()).toBeTruthy());
		const overlayHost = tooltip()!.parentElement!.parentElement!;

		// Detaching removes the content under the pointer, so it never receives the matching pointerleave.
		const enterWhileClosing = brnTooltip.hide.subscribe(() => pointer(overlayHost, 'pointerenter'));
		pointer(trigger, 'pointerleave');
		await waitFor(() => expect(tooltip()).toBeNull());
		enterWhileClosing.unsubscribe();

		pointer(trigger, 'pointerenter');
		await waitFor(() => expect(tooltip()).toBeTruthy());

		pointer(trigger, 'pointerleave');
		await waitFor(() => expect(tooltip()).toBeNull());
	});

	it('stays open when revived during its exit animation and then hovered', async () => {
		const fixture = TestBed.createComponent(TooltipHost);
		await fixture.whenStable();
		const trigger: HTMLElement = fixture.nativeElement.querySelector('button');
		const brnTooltip = fixture.debugElement.query(By.directive(BrnTooltip)).injector.get(BrnTooltip);
		const tooltip = () => document.querySelector('[role="tooltip"]');
		const exitDuration = 200;

		pointer(trigger, 'pointerenter');
		await waitFor(() => expect(tooltip()).toBeTruthy());
		const overlayHost = tooltip()!.parentElement!.parentElement!;

		// The test setup disables CSS animations; a Web Animation still holds the detach until it finishes.
		const animateExit = brnTooltip.hide.subscribe(() =>
			tooltip()!.animate([{ opacity: 1 }, { opacity: 0 }], exitDuration),
		);
		pointer(trigger, 'pointerleave');
		await waitFor(() => expect(tooltip()).toHaveAttribute('data-state', 'closed'));
		animateExit.unsubscribe();

		pointer(trigger, 'pointerenter');
		await waitFor(() => expect(tooltip()).toHaveAttribute('data-state', 'open'));
		pointer(overlayHost, 'pointerenter');
		pointer(trigger, 'pointerleave');
		await new Promise((resolve) => setTimeout(resolve, exitDuration * 2));
		expect(tooltip()).toHaveAttribute('data-state', 'open');

		pointer(overlayHost, 'pointerleave');
		await waitFor(() => expect(tooltip()).toBeNull());
	});
});
