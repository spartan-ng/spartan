import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import { HlmTooltip } from './hlm-tooltip';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const EXIT_MS = 150;

@Component({
	selector: 'hlm-tooltip-animation-host',
	imports: [HlmTooltip],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmTooltip="tip" [showDelay]="0" [hideDelay]="0">trigger</button>
	`,
})
class TooltipAnimationHost {}

const triggerEl = () => screen.getByText('trigger');
const tooltipEl = () => document.querySelector('[role="tooltip"]');
const tooltipState = () => tooltipEl()?.getAttribute('data-state');

describe('HlmTooltip animation-aware teardown', () => {
	let style: HTMLStyleElement;

	beforeEach(() => {
		// Tailwind's animate-out utilities are not loaded in unit tests, so stand in a real
		// keyframe on the content's closed state to exercise the exit animation.
		style = document.createElement('style');
		style.textContent = `
			@keyframes brn-test-tooltip-exit { from { opacity: 1; } to { opacity: 0; } }
			[role='tooltip'][data-state='closed'] { animation: brn-test-tooltip-exit ${EXIT_MS}ms linear; }
		`;
		document.head.appendChild(style);
	});

	afterEach(() => {
		style.remove();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps the tooltip mounted while the exit animation runs, then disposes it', async () => {
		await render(TooltipAnimationHost);

		fireEvent.mouseEnter(triggerEl());
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.mouseLeave(triggerEl());
		// Marked closed but still mounted while the exit animation runs.
		await waitFor(() => expect(tooltipState()).toBe('closed'));
		expect(tooltipEl()).toBeTruthy();

		// After the animation completes it is detached.
		await waitFor(() => expect(tooltipEl()).toBeNull(), { timeout: EXIT_MS + 500 });
	});

	it('revives the tooltip when re-hovered mid-animation', async () => {
		await render(TooltipAnimationHost);

		fireEvent.mouseEnter(triggerEl());
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.mouseLeave(triggerEl());
		await waitFor(() => expect(tooltipState()).toBe('closed'));

		// Re-hover before the exit animation finishes: it must flip back open...
		fireEvent.mouseEnter(triggerEl());
		await waitFor(() => expect(tooltipState()).toBe('open'));

		// ...and survive past the moment the pending teardown would have fired.
		await wait(EXIT_MS + 120);
		expect(tooltipEl()).toBeTruthy();
		expect(tooltipState()).toBe('open');
	});
});

describe('HlmTooltip teardown without an exit animation', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('detaches promptly when there is no exit animation', async () => {
		await render(TooltipAnimationHost);

		fireEvent.mouseEnter(triggerEl());
		await waitFor(() => expect(tooltipEl()).toBeTruthy());

		fireEvent.mouseLeave(triggerEl());
		await waitFor(() => expect(tooltipEl()).toBeNull());
	});
});
