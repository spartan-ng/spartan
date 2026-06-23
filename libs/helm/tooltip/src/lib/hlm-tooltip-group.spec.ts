import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { HlmTooltip } from './hlm-tooltip';

@Component({
	selector: 'hlm-tooltip-group-host',
	imports: [HlmTooltip],
	providers: [Directionality, provideBrnTooltipGroup({ skipDelayDuration: 1000 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	// Centered + spaced so neither overlay lands under the headless cursor (0,0).
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; gap: 200px">
			<button hlmTooltip="first" [showDelay]="100" [hideDelay]="0">one</button>
			<button hlmTooltip="second" [showDelay]="100" [hideDelay]="0">two</button>
		</div>
	`,
})
class TooltipGroupHost {}

// Short skip window so the reset-path test can wait it out quickly. showDelay is 0, so a delayed vs an
// instant open is distinguishable purely by data-state, not by timing.
@Component({
	selector: 'hlm-tooltip-group-short-host',
	imports: [HlmTooltip],
	providers: [Directionality, provideBrnTooltipGroup({ skipDelayDuration: 50 })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div style="position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; gap: 200px">
			<button hlmTooltip="first" [showDelay]="0" [hideDelay]="0">one</button>
			<button hlmTooltip="second" [showDelay]="0" [hideDelay]="0">two</button>
		</div>
	`,
})
class TooltipGroupShortWindowHost {}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const tooltipByText = (text: string) =>
	Array.from(document.querySelectorAll('[role="tooltip"]')).find((el) => el.textContent?.includes(text));

describe('HlmTooltip skip-delay grouping', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('opens the first tooltip delayed, then the next instantly within the skip window', async () => {
		await render(TooltipGroupHost);

		// First open waits for its delay -> animated "open".
		fireEvent.mouseEnter(screen.getByText('one'));
		await waitFor(() => expect(tooltipByText('first')?.getAttribute('data-state')).toBe('open'));

		// Second opens within the window -> "instant-open" (no enter animation).
		fireEvent.mouseEnter(screen.getByText('two'));
		await waitFor(() => {
			const el = tooltipByText('second');
			expect(el).toBeTruthy();
			expect(el?.getAttribute('data-state')).toBe('instant-open');
		});
	});

	it('restores the delay once the skip window elapses after the group closes', async () => {
		await render(TooltipGroupShortWindowHost);

		// Open then close the first tooltip - closing starts the window's expiry timer.
		fireEvent.mouseEnter(screen.getByText('one'));
		await waitFor(() => expect(tooltipByText('first')).toBeTruthy());
		fireEvent.mouseLeave(screen.getByText('one'));
		await waitFor(() => expect(tooltipByText('first')).toBeFalsy());

		// After the window elapses, the next open is delayed again -> animated "open", not "instant-open".
		await wait(90);
		fireEvent.mouseEnter(screen.getByText('two'));
		await waitFor(() => {
			const el = tooltipByText('second');
			expect(el).toBeTruthy();
			expect(el?.getAttribute('data-state')).toBe('open');
		});
	});
});
