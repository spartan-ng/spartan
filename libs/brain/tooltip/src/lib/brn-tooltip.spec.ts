import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { userEvent } from '@vitest/browser/context';
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

describe('BrnTooltip', () => {
	// The real mouse starts at (0,0), where both the trigger and the not-yet-positioned overlay sit.
	// Linux Chrome then fires a trusted pointerenter on the overlay that the synthetic events never undo.
	beforeEach(async () => {
		const away = document.createElement('div');
		away.style.cssText = 'position:fixed;left:300px;top:200px;width:20px;height:20px';
		document.body.appendChild(away);
		await userEvent.hover(away);
		away.remove();
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
		await vi.waitFor(() => expect(tooltip()).toBeTruthy());
		const overlayHost = tooltip()!.parentElement!.parentElement!;

		// Detaching removes the content under the pointer, so it never receives the matching pointerleave.
		const enterWhileClosing = brnTooltip.hide.subscribe(() => pointer(overlayHost, 'pointerenter'));
		pointer(trigger, 'pointerleave');
		await vi.waitFor(() => expect(tooltip()).toBeNull());
		enterWhileClosing.unsubscribe();

		pointer(trigger, 'pointerenter');
		await vi.waitFor(() => expect(tooltip()).toBeTruthy());

		pointer(trigger, 'pointerleave');
		await vi.waitFor(() => expect(tooltip()).toBeNull());
	});

	it('stays open when revived during its exit animation and then hovered', async () => {
		const fixture = TestBed.createComponent(TooltipHost);
		await fixture.whenStable();
		const trigger: HTMLElement = fixture.nativeElement.querySelector('button');
		const brnTooltip = fixture.debugElement.query(By.directive(BrnTooltip)).injector.get(BrnTooltip);
		const tooltip = () => document.querySelector('[role="tooltip"]');
		const exitDuration = 200;

		pointer(trigger, 'pointerenter');
		await vi.waitFor(() => expect(tooltip()).toBeTruthy());
		const overlayHost = tooltip()!.parentElement!.parentElement!;

		// The test setup disables CSS animations; a Web Animation still holds the detach until it finishes.
		const animateExit = brnTooltip.hide.subscribe(() =>
			tooltip()!.animate([{ opacity: 1 }, { opacity: 0 }], exitDuration),
		);
		pointer(trigger, 'pointerleave');
		await vi.waitFor(() => expect(tooltip()).toHaveAttribute('data-state', 'closed'));
		animateExit.unsubscribe();

		pointer(trigger, 'pointerenter');
		await vi.waitFor(() => expect(tooltip()).toHaveAttribute('data-state', 'open'));
		pointer(overlayHost, 'pointerenter');
		pointer(trigger, 'pointerleave');
		await new Promise((resolve) => setTimeout(resolve, exitDuration * 2));
		expect(tooltip()).toHaveAttribute('data-state', 'open');

		pointer(overlayHost, 'pointerleave');
		await vi.waitFor(() => expect(tooltip()).toBeNull());
	});
});
