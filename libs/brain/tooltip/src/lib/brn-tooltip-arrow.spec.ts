import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { BrnTooltip } from './brn-tooltip';

// A trigger pinned to the top-left corner with a large tooltip: 'top' is off-screen and the
// left/right sides can't fit the tall panel, so CDK keeps 'bottom' and *pushes* it right to stay in
// the viewport. That push is what knocks a center-anchored arrow off the trigger (issue #1247).
@Component({
	selector: 'brn-tooltip-arrow-host',
	imports: [BrnTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			brnTooltip="tip"
			position="bottom"
			[showDelay]="0"
			[hideDelay]="0"
			style="position: fixed; top: 0; left: 0; width: 40px; height: 24px"
		>
			trigger
		</button>
	`,
})
class TooltipArrowHost {}

const triggerEl = () => screen.getByText('trigger');
const tooltipEl = () => document.querySelector<HTMLElement>('[role="tooltip"]');
const arrowEl = () => tooltipEl()?.querySelector<HTMLElement>('span') ?? null;
const centerX = (el: Element) => {
	const rect = el.getBoundingClientRect();
	return rect.left + rect.width / 2;
};

describe('BrnTooltip arrow anchoring (#1247)', () => {
	let style: HTMLStyleElement;

	beforeEach(() => {
		// Tailwind utilities aren't loaded in unit tests, so stand in the geometry the arrow relies on
		// in production: a fixed-size panel with the arrow absolutely centered on it. The directive's
		// job under test is to slide that centered arrow back onto the trigger after a push.
		style = document.createElement('style');
		style.textContent = `
			[role='tooltip'] { position: relative; box-sizing: border-box; width: 120px; height: 480px; }
			[role='tooltip'] > span { position: absolute; top: 0; left: calc(50% - 5px); display: block; width: 10px; height: 10px; }
		`;
		document.head.appendChild(style);
	});

	afterEach(() => {
		style.remove();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps the arrow pointing at the trigger when the tooltip is pushed into the viewport', async () => {
		await render(TooltipArrowHost);

		fireEvent.mouseEnter(triggerEl());
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		const tooltip = tooltipEl() as HTMLElement;
		// Preconditions: the scenario must be a horizontal push, not a flip. If CDK behaved differently
		// in this environment these fail loudly rather than letting the real assertion pass by accident.
		expect(tooltip.getAttribute('data-side')).toBe('bottom');
		expect(tooltip.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);

		// The tooltip is pushed, so its center is well to the right of the trigger's center...
		expect(centerX(tooltip) - centerX(triggerEl())).toBeGreaterThan(20);

		// ...but the arrow must still sit over the trigger's center.
		await waitFor(() => expect(Math.abs(centerX(arrowEl() as Element) - centerX(triggerEl()))).toBeLessThanOrEqual(2));
	});
});
