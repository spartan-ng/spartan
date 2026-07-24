import { ChangeDetectionStrategy, Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { render } from '@testing-library/angular';
import { HlmDialog } from './hlm-dialog';
import { HlmDialogContent } from './hlm-dialog-content';
import { HlmDialogPortal } from './hlm-dialog-portal';
import { HlmDialogTrigger } from './hlm-dialog-trigger';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const flush = () => wait(0);

const EXIT_MS = 150;

@Component({
	selector: 'hlm-dialog-animation-host',
	imports: [HlmDialog, HlmDialogContent, HlmDialogPortal, HlmDialogTrigger],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog>
			<button hlmDialogTrigger>open</button>
			<hlm-dialog-content *hlmDialogPortal="let ctx">
				<span data-testid="content">content</span>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
class DialogAnimationHost {}

const dialogOf = (view: Awaited<ReturnType<typeof render>>) =>
	view.fixture.debugElement.query(By.directive(HlmDialog)).injector.get(BrnDialog);
const panel = () => document.querySelector('.cdk-overlay-pane');

describe('HlmDialog animation-aware teardown', () => {
	let style: HTMLStyleElement;

	beforeEach(() => {
		// Global style: the overlay pane (which receives data-state) animates out when closing.
		style = document.createElement('style');
		style.textContent = `
			@keyframes brn-test-dialog-exit { from { opacity: 1; } to { opacity: 0; } }
			.cdk-overlay-pane[data-state='closed'] { animation: brn-test-dialog-exit ${EXIT_MS}ms linear; }
		`;
		document.head.appendChild(style);
	});

	afterEach(() => {
		style.remove();
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('keeps the panel mounted while the exit animation runs, then disposes it', async () => {
		const view = await render(DialogAnimationHost);
		const dialog = dialogOf(view);

		dialog.open();
		view.detectChanges();
		await flush();
		expect(panel()).toBeTruthy();

		dialog.close();
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
		const view = await render(DialogAnimationHost);
		const dialog = dialogOf(view);

		dialog.open();
		view.detectChanges();
		await flush();

		dialog.close();
		view.detectChanges();
		await flush();
		await flush();

		// The exit animation defaults to fill-mode none; the dialog must hold it forwards so the
		// element stays hidden through the async disposal gap instead of snapping back to visible.
		const animations = panel()?.getAnimations() ?? [];
		expect(animations.length).toBeGreaterThan(0);
		for (const animation of animations) {
			expect(animation.effect?.getComputedTiming().fill).toBe('forwards');
		}

		// Pinned or not, the panel still disposes once the animation completes.
		await wait(EXIT_MS + 120);
		expect(panel()).toBeNull();
	});
});

describe('HlmDialog teardown without an exit animation', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('disposes the panel promptly when there is no exit animation', async () => {
		const view = await render(DialogAnimationHost);
		const dialog = dialogOf(view);

		dialog.open();
		view.detectChanges();
		await flush();
		expect(panel()).toBeTruthy();

		dialog.close();
		view.detectChanges();
		await flush();
		await flush();

		expect(panel()).toBeNull();
	});
});
