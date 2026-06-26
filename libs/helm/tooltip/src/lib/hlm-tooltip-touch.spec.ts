import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { HlmTooltip } from './hlm-tooltip';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Component({
	selector: 'hlm-tooltip-touch-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	// Center the trigger so the overlay never lands under the headless browser's resting cursor (0,0);
	// the "outside" target is pinned to a corner well clear of the centered tooltip.
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center">
			<button hlmTooltip="tip" [showDelay]="0" [hideDelay]="0">trigger</button>
		</div>
		<button data-testid="outside" style="position: fixed; bottom: 0; right: 0">outside</button>
	`,
})
class TooltipTouchHost {}

const triggerEl = () => screen.getByText('trigger');
const outsideEl = () => screen.getByTestId('outside');
const tooltipEl = () => document.querySelector('[role="tooltip"]');

describe('HlmTooltip touch interactions', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('shows on a touch pointerdown on the trigger', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });

		await waitFor(() => expect(tooltipEl()).toBeTruthy());
	});

	it('does not show on a mouse pointerdown (mouse opens via hover, not tap)', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'mouse' });

		await wait(50);
		expect(tooltipEl()).toBeNull();
	});

	it('dismisses when a touch pointerdown lands outside the trigger and the tooltip', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.pointerDown(outsideEl(), { pointerType: 'touch' });
		await waitFor(() => expect(tooltipEl()).toBeNull());
	});

	it('stays open when a touch pointerdown lands inside the tooltip', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.pointerDown(tooltipEl() as Element, { pointerType: 'touch' });

		await wait(50);
		expect(tooltipEl()).toBeTruthy();
	});

	it('stays open when a touch pointerdown re-taps the trigger', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });

		await wait(50);
		expect(tooltipEl()).toBeTruthy();
	});

	it('ignores a mouse pointerdown outside (only touch dismisses via this path)', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.pointerDown(outsideEl(), { pointerType: 'mouse' });

		await wait(50);
		expect(tooltipEl()).toBeTruthy();
	});

	it('hides on scroll while shown via touch', async () => {
		await render(TooltipTouchHost);

		fireEvent.pointerDown(triggerEl(), { pointerType: 'touch' });
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		window.dispatchEvent(new Event('scroll'));
		await waitFor(() => expect(tooltipEl()).toBeNull());
	});
});
