import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { render } from '@testing-library/angular';
import { HlmPopover } from './hlm-popover';
import { HlmPopoverContent } from './hlm-popover-content';
import { HlmPopoverPortal } from './hlm-popover-portal';
import { HlmPopoverTrigger } from './hlm-popover-trigger';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const flush = () => wait(0);

const EXIT_MS = 150;

@Component({
	selector: 'hlm-popover-animation-host',
	imports: [HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-popover>
			<button hlmPopoverTrigger>open</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<span data-testid="content">content</span>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
class PopoverAnimationHost {}

const popoverOf = (view: Awaited<ReturnType<typeof render>>) =>
	view.fixture.debugElement.query(By.directive(HlmPopover)).injector.get(BrnPopover);
const panel = () => document.querySelector('.cdk-overlay-pane');

describe('HlmPopover animation-aware teardown', () => {
	let style: HTMLStyleElement;

	beforeEach(() => {
		// Global style: the overlay pane (which receives data-state) animates out when closing.
		style = document.createElement('style');
		style.textContent = `
			@keyframes brn-test-popover-exit { from { opacity: 1; } to { opacity: 0; } }
			.cdk-overlay-pane[data-state='closed'] { animation: brn-test-popover-exit ${EXIT_MS}ms linear; }
		`;
		document.head.appendChild(style);
	});

	afterEach(() => {
		style.remove();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps the panel mounted while the exit animation runs, then disposes it', async () => {
		const view = await render(PopoverAnimationHost);
		const popover = popoverOf(view);

		popover.open();
		view.detectChanges();
		await flush();
		expect(panel()).toBeTruthy();

		popover.close();
		view.detectChanges();
		await flush();

		// Still mounted during the exit animation, marked closed.
		expect(panel()).toBeTruthy();
		expect(panel()?.getAttribute('data-state')).toBe('closed');

		// After the animation completes it is disposed.
		await wait(EXIT_MS + 120);
		expect(panel()).toBeNull();
	});

	it('pins the exit animation to its final frame so it cannot snap back before disposal', async () => {
		const view = await render(PopoverAnimationHost);
		const popover = popoverOf(view);

		popover.open();
		view.detectChanges();
		await flush();

		popover.close();
		view.detectChanges();
		await flush();
		await flush();

		// The exit animation defaults to fill-mode none; the overlay must hold it forwards.
		const animations = panel()?.getAnimations() ?? [];
		expect(animations.length).toBeGreaterThan(0);
		for (const animation of animations) {
			expect(animation.effect?.getComputedTiming().fill).toBe('forwards');
		}

		// Pinned or not, the panel still disposes once the animation completes.
		await wait(EXIT_MS + 120);
		expect(panel()).toBeNull();
	});

	it('cancels the pending teardown when reopened mid-animation', async () => {
		const view = await render(PopoverAnimationHost);
		const popover = popoverOf(view);

		popover.open();
		view.detectChanges();
		await flush();

		popover.close();
		view.detectChanges();
		await flush();
		expect(panel()).toBeTruthy();

		// Reopen before the exit animation finishes: the panel must survive and report open.
		popover.open();
		view.detectChanges();
		await wait(EXIT_MS + 120);

		expect(panel()).toBeTruthy();
		expect(popover.stateComputed()).toBe('open');
		expect(panel()?.getAttribute('data-state')).toBe('open');
	});
});

describe('HlmPopover teardown without an exit animation', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('disposes the panel promptly when there is no exit animation', async () => {
		const view = await render(PopoverAnimationHost);
		const popover = popoverOf(view);

		popover.open();
		view.detectChanges();
		await flush();
		expect(panel()).toBeTruthy();

		popover.close();
		view.detectChanges();
		await flush();
		await flush();

		expect(panel()).toBeNull();
	});
});
