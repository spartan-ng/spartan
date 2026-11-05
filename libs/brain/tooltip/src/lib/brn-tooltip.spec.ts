import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnTooltip } from './brn-tooltip';

@Component({
	imports: [BrnTooltip],
	template: `
		<button brnTooltip="Tooltip">Trigger</button>
	`,
})
class TooltipHost {}

const pointer = (target: Element, type: 'pointerenter' | 'pointerleave') =>
	target.dispatchEvent(new PointerEvent(type, { pointerType: 'mouse' }));

const nextTimer = () => new Promise((resolve) => setTimeout(resolve));

describe('BrnTooltip', () => {
	afterEach(() => {
		TestBed.resetTestingModule();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('still hides on trigger leave after the content was hovered while closing', async () => {
		const fixture = TestBed.createComponent(TooltipHost);
		await fixture.whenStable();
		const trigger: HTMLElement = fixture.nativeElement.querySelector('button');
		const tooltip = () => document.querySelector('[role="tooltip"]');

		pointer(trigger, 'pointerenter');
		await nextTimer();
		await fixture.whenStable();
		const overlayHost = tooltip()?.parentElement?.parentElement;
		expect(overlayHost).toBeTruthy();

		pointer(trigger, 'pointerleave');
		await nextTimer();
		// Detaching removes the content under the pointer, so it never receives the matching pointerleave.
		pointer(overlayHost!, 'pointerenter');
		await fixture.whenStable();
		expect(tooltip()).toBeNull();

		pointer(trigger, 'pointerenter');
		await nextTimer();
		await fixture.whenStable();
		expect(tooltip()).toBeTruthy();

		pointer(trigger, 'pointerleave');
		await nextTimer();
		await fixture.whenStable();
		expect(tooltip()).toBeNull();
	});
});
