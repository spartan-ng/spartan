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

describe('BrnTooltip', () => {
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
});
