import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { render } from '@testing-library/angular';
import { BrnDrawerImports } from '../index';
import { BrnDrawer } from './brn-drawer';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const byTestId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;

/** Polls until the assertion passes, like Testing Library's `waitFor`. */
async function waitFor(assertion: () => void, timeout = 1000) {
	const start = performance.now();
	for (;;) {
		try {
			assertion();
			return;
		} catch (error) {
			if (performance.now() - start > timeout) throw error;
			await wait(10);
		}
	}
}

/**
 * The test setup collapses every transition and animation. Re-enables them for tests that rely on a
 * real exit animation, and returns a function that disables them again.
 */
function enableAnimations() {
	const sheets = Array.from(document.styleSheets).filter((sheet) =>
		(sheet.ownerNode as HTMLElement | null)?.textContent?.includes('animation: none !important'),
	);
	sheets.forEach((sheet) => (sheet.disabled = true));
	return () => sheets.forEach((sheet) => (sheet.disabled = false));
}

/** Records the callbacks of every `ResizeObserver` created while installed, without observing anything. */
function stubResizeObserver() {
	const callbacks: ResizeObserverCallback[] = [];
	const original = globalThis.ResizeObserver;
	globalThis.ResizeObserver = class {
		constructor(callback: ResizeObserverCallback) {
			callbacks.push(callback);
		}
		observe() {
			// Never observes anything.
		}
		unobserve() {
			// Never observes anything.
		}
		disconnect() {
			// Never observes anything.
		}
	} as unknown as typeof ResizeObserver;
	return {
		callbacks,
		restore: () => (globalThis.ResizeObserver = original),
	};
}

function getDrawer(view: Awaited<ReturnType<typeof render>>, testId?: string): BrnDrawer {
	const debugElement = testId
		? view.fixture.debugElement.query(By.css(`[data-testid="${testId}"]`))
		: view.fixture.debugElement.query(By.directive(BrnDrawer));
	return debugElement.injector.get(BrnDrawer);
}

async function settle(view: Awaited<ReturnType<typeof render>>, ms = 50) {
	view.detectChanges();
	await wait(ms);
	view.detectChanges();
}

@Component({
	selector: 'brn-drawer-popup-no-viewport-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'">
			<div *brnDrawerPortal>
				<div brnDrawerPopup>Drawer</div>
			</div>
		</div>
	`,
})
class NoViewportHost {}

@Component({
	selector: 'brn-drawer-popup-focus-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<input />
			<div brnDrawer [modal]="false" [autoFocus]="autoFocus()">
				<button brnDrawerTrigger>Open</button>
				<div *brnDrawerPortal brnDrawerViewport>
					<div brnDrawerPopup data-testid="popup">
						<input data-testid="popup-input" />
					</div>
				</div>
			</div>
		</div>
	`,
})
class FocusHost {
	public readonly autoFocus = input<boolean | string>('[data-drawer-popup]');
}

@Component({
	selector: 'brn-drawer-popup-keydown-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup>
					<input aria-label="Field" data-testid="field" />
				</div>
			</div>
		</div>
	`,
})
class KeydownHost {}

@Component({
	selector: 'brn-drawer-popup-upward-snap-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnDrawer
			defaultSnapPoint="100px"
			[state]="'open'"
			[modal]="false"
			[snapPoints]="['100px', '300px']"
			swipeDirection="up"
		>
			<div *brnDrawerPortal brnDrawerViewport style="height: 400px">
				<div brnDrawerPopup data-testid="popup" style="height: 300px">Drawer</div>
			</div>
		</div>
	`,
})
class UpwardSnapHost {}

@Component({
	selector: 'brn-drawer-popup-height-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport style="height: 400px">
				@if (showPopup()) {
					<div brnDrawerPopup data-testid="popup" style="height: 100px">Drawer</div>
				}
			</div>
		</div>
	`,
})
class PopupHeightHost {
	public readonly showPopup = input(true);
}

@Component({
	selector: 'brn-drawer-popup-border-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [state]="'open'">
						<div *brnDrawerPortal brnDrawerViewport>
							<div
								brnDrawerPopup
								data-testid="child-popup"
								style="height: 100px; border-top: 2px solid transparent; border-bottom: 2px solid transparent"
							>
								<div style="height: 10px">Child drawer</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class BorderHost {}

@Component({
	selector: 'brn-drawer-popup-nested-report-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [state]="childOpen() ? 'open' : 'closed'" [modal]="false" [autoFocus]="false">
						<div *brnDrawerPortal brnDrawerViewport>
							<div brnDrawerPopup style="height: 100px">Child drawer</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class NestedReportHost {
	public readonly childOpen = input(false);
}

@Component({
	selector: 'brn-drawer-popup-closed-sibling-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [state]="'open'" [modal]="false">
						<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Open child</div></div>
					</div>
					<!-- A closed drawer opened by a detached trigger; it comes after the open sibling. -->
					<div brnDrawer #closedChild="brnDrawer" [modal]="false">
						<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Closed child</div></div>
					</div>
					<button [brnDrawerTriggerFor]="closedChild">Open closed child</button>
				</div>
			</div>
		</div>
	`,
})
class ClosedSiblingHost {}

@Component({
	selector: 'brn-drawer-popup-nested-dialog-host',
	imports: [BrnDrawerImports, BrnDialogImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [state]="'open'" [modal]="false">
						<div *brnDrawerPortal brnDrawerViewport>
							<div brnDrawerPopup data-testid="child-popup">
								<div brnDialog [hasBackdrop]="false">
									<button brnDialogTrigger>Open dialog</button>
									<div *brnDialogContent data-testid="dialog-popup">Dialog</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class NestedDialogHost {}

@Component({
	selector: 'brn-drawer-popup-nested-alert-dialog-host',
	imports: [BrnDrawerImports, BrnAlertDialogImports, BrnDialogImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [state]="'open'" [modal]="false">
						<div *brnDrawerPortal brnDrawerViewport>
							<div brnDrawerPopup data-testid="child-popup">
								<div brnAlertDialog>
									<button brnAlertDialogTrigger>Open alert dialog</button>
									<div *brnAlertDialogContent data-testid="alert-dialog-popup">
										Alert dialog
										<button brnDialogClose>Close alert dialog</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class NestedAlertDialogHost {}

@Component({
	selector: 'brn-drawer-popup-nested-close-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [modal]="false">
						<button brnDrawerTrigger>Open nested drawer</button>
						<div *brnDrawerPortal brnDrawerViewport>
							<div brnDrawerPopup data-testid="child-popup">
								<button brnDrawerClose>Close nested drawer</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class NestedCloseHost {}

@Component({
	selector: 'brn-drawer-popup-nested-exit-host',
	imports: [BrnDrawerImports],
	// eslint-disable-next-line @nx/workspace-avoid-component-styles
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// eslint-disable-next-line @nx/workspace-avoid-component-styles
	styles: `
		@keyframes test-drawer-exit {
			to {
				opacity: 0;
			}
		}

		.animation-test-child-popup[data-ending-style] {
			animation: test-drawer-exit 100ms;
		}
	`,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="parent-popup">
					<div brnDrawer [state]="'open'" [modal]="false">
						<div *brnDrawerPortal brnDrawerViewport>
							<div brnDrawerPopup class="animation-test-child-popup" data-testid="child-popup">
								<button brnDrawerClose>Close nested drawer</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class NestedExitHost {}

@Component({
	selector: 'brn-drawer-popup-nested-height-host',
	imports: [BrnDrawerImports],
	// eslint-disable-next-line @nx/workspace-avoid-component-styles
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// eslint-disable-next-line @nx/workspace-avoid-component-styles
	styles: `
		@keyframes test-drawer-exit {
			to {
				opacity: 0;
			}
		}

		.animation-test-parent-popup {
			height: var(--drawer-height, auto);
			overflow: hidden;
			transition: height 100ms linear;
		}

		.animation-test-parent-popup[data-nested-drawer-open] {
			height: var(--drawer-frontmost-height, var(--drawer-height));
		}

		.animation-test-parent-content {
			display: block;
			height: 160px;
		}

		.animation-test-child-content {
			display: block;
			height: 64px;
		}

		.animation-test-exit-popup[data-ending-style] {
			animation: test-drawer-exit 100ms;
		}
	`,
	template: `
		<div brnDrawer [state]="'open'" [modal]="false">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup class="animation-test-parent-popup" data-testid="parent-popup">
					<div class="animation-test-parent-content"></div>
					<div brnDrawer [modal]="false">
						<button brnDrawerTrigger>Open nested drawer</button>
						<div *brnDrawerPortal brnDrawerViewport>
							<div brnDrawerPopup [class.animation-test-exit-popup]="exitAnimation()" data-testid="child-popup">
								<div class="animation-test-child-content"></div>
								<button brnDrawerClose>Close nested drawer</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
})
class NestedHeightHost {
	public readonly exitAnimation = input(true);
}

const clickButton = (name: string) =>
	(
		Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === name) as HTMLElement
	).click();

describe('BrnDrawerPopup', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('warns in development when not rendered within a viewport', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		try {
			const view = await render(NoViewportHost);
			await settle(view);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('brnDrawerPopup expected to be rendered within brnDrawerViewport.'),
			);
		} finally {
			consoleErrorSpy.mockRestore();
		}
	});

	it('defaults initial focus to the popup element', async () => {
		const view = await render(FocusHost);

		(document.querySelector('button') as HTMLButtonElement).click();
		await settle(view);

		await waitFor(() => expect(byTestId('popup')).toHaveFocus());
		expect(byTestId('popup-input')).not.toHaveFocus();
	});

	it('leaves focus on the trigger when initial focus is disabled', async () => {
		const view = await render(FocusHost, { inputs: { autoFocus: false } });
		const trigger = document.querySelector('button') as HTMLButtonElement;

		trigger.focus();
		trigger.click();
		await settle(view);

		await waitFor(() => expect(byTestId('popup')).toBeVisible());
		expect(trigger).toHaveFocus();
	});

	it('stops composite navigation keys from escaping the popup', async () => {
		const view = await render(KeydownHost);
		await settle(view);
		// The popup renders in an overlay outside the host, so listen where its events bubble to.
		const handleKeyDown = vi.fn();
		document.body.addEventListener('keydown', handleKeyDown);

		try {
			const field = byTestId('field');
			field.focus();
			field.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
			expect(handleKeyDown).not.toHaveBeenCalled();

			field.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
			expect(handleKeyDown).toHaveBeenCalled();
		} finally {
			document.body.removeEventListener('keydown', handleKeyDown);
		}
	});

	it('applies a negative snap point offset to upward drawers', async () => {
		const view = await render(UpwardSnapHost);
		await settle(view);

		await waitFor(() => {
			view.detectChanges();
			expect(byTestId('popup').style.getPropertyValue('--drawer-snap-point-offset')).toBe('-200px');
		});
		expect(byTestId('popup')).toHaveAttribute('data-swipe-direction', 'up');
	});

	it('keeps the last measured popup height while nested content stretches it', async () => {
		const resizeObserver = stubResizeObserver();

		try {
			const view = await render(PopupHeightHost);
			await settle(view);
			const drawer = getDrawer(view);

			await waitFor(() => expect(drawer.popupHeight()).toBe(100));

			drawer.onNestedFrontmostHeightChange(200);
			view.detectChanges();
			byTestId('popup').style.height = '150px';
			resizeObserver.callbacks.forEach((callback) => callback([], {} as ResizeObserver));
			view.detectChanges();

			expect(drawer.popupHeight()).toBe(100);
		} finally {
			resizeObserver.restore();
		}
	});

	it('ignores a queued measurement after the popup unmounts', async () => {
		const resizeObserver = stubResizeObserver();

		try {
			const view = await render(PopupHeightHost);
			await settle(view);
			expect(byTestId('popup')).toBeVisible();
			const callbacks = resizeObserver.callbacks.slice();

			await view.rerender({ inputs: { showPopup: false }, partialUpdate: true });
			view.detectChanges();
			expect(byTestId('popup')).toBeNull();

			expect(() => callbacks.forEach((callback) => callback([], {} as ResizeObserver))).not.toThrow();
		} finally {
			resizeObserver.restore();
		}
	});

	it('includes border size in frontmost height CSS variable for nested drawers', async () => {
		const view = await render(BorderHost);
		await settle(view);

		const parentPopup = byTestId('parent-popup');
		const childPopup = byTestId('child-popup');

		await waitFor(() => {
			view.detectChanges();
			expect(parentPopup.style.getPropertyValue('--drawer-frontmost-height')).toBe(`${childPopup.offsetHeight}px`);
		});
		expect(childPopup.offsetHeight).toBeGreaterThan(childPopup.scrollHeight);
	});

	it('reports nested presence and frontmost height once a nested drawer opens', async () => {
		const view = await render(NestedReportHost);
		await settle(view);

		await view.rerender({ inputs: { childOpen: true }, partialUpdate: true });
		await settle(view);

		const parentPopup = byTestId('parent-popup');
		expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('1');
		expect(parentPopup).toHaveAttribute('data-nested-drawer-open', '');
		expect(parentPopup.style.getPropertyValue('--drawer-frontmost-height')).toBe('100px');
	});

	it('keeps the parent nested state when a closed detached-trigger nested drawer mounts', async () => {
		const view = await render(ClosedSiblingHost);
		await settle(view);

		const parentPopup = byTestId('parent-popup');
		await waitFor(() => expect(parentPopup).toHaveAttribute('data-nested-drawer-open'));
		expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('1');
	});

	it.each([
		{ label: 'dialogs', host: NestedDialogHost, button: 'Open dialog', popup: 'dialog-popup' },
		{ label: 'alert dialogs', host: NestedAlertDialogHost, button: 'Open alert dialog', popup: 'alert-dialog-popup' },
	])('does not treat $label inside nested drawers as nested drawers', async ({ host, button, popup }) => {
		const view = await render(host);
		await settle(view);

		const parentPopup = byTestId('parent-popup');
		const childPopup = byTestId('child-popup');
		const observedNestedDrawerCounts = [parentPopup.style.getPropertyValue('--nested-drawers')];
		const observer = new MutationObserver(() => {
			observedNestedDrawerCounts.push(parentPopup.style.getPropertyValue('--nested-drawers'));
		});
		observer.observe(parentPopup, { attributeFilter: ['style'], attributes: true });

		await waitFor(() => expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('1'));
		expect(childPopup.style.getPropertyValue('--nested-drawers')).toBe('0');
		expect(childPopup).not.toHaveAttribute('data-nested-drawer-open');

		clickButton(button);
		await settle(view);

		await waitFor(() => expect(byTestId(popup)).toBeVisible());
		await waitFor(() => expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('1'));
		expect(childPopup.style.getPropertyValue('--nested-drawers')).toBe('0');
		expect(childPopup).not.toHaveAttribute('data-nested-drawer-open');

		observer.disconnect();
		expect(observedNestedDrawerCounts).not.toContain('2');
	});

	it('clears parent nested drawer state as soon as a nested drawer closes', async () => {
		const view = await render(NestedCloseHost);
		await settle(view);

		const parentPopup = byTestId('parent-popup');
		expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('0');
		expect(parentPopup).not.toHaveAttribute('data-nested-drawer-open');

		clickButton('Open nested drawer');
		await settle(view);

		await waitFor(() => expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('1'));
		expect(parentPopup).toHaveAttribute('data-nested-drawer-open', '');
		const childPopup = byTestId('child-popup');

		clickButton('Close nested drawer');
		view.detectChanges();

		expect(childPopup).toBeInTheDocument();
		expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('0');
		expect(parentPopup).not.toHaveAttribute('data-nested-drawer-open');
	});

	it('clears parent nested drawer state when a nested drawer starts closing before unmount', async () => {
		const disableAnimations = enableAnimations();

		try {
			const view = await render(NestedExitHost);
			await settle(view);

			const parentPopup = byTestId('parent-popup');
			await waitFor(() => expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('1'));
			expect(parentPopup).toHaveAttribute('data-nested-drawer-open', '');

			clickButton('Close nested drawer');
			view.detectChanges();

			await waitFor(() => expect(byTestId('child-popup')).toHaveAttribute('data-ending-style'));
			expect(parentPopup.style.getPropertyValue('--nested-drawers')).toBe('0');
			expect(parentPopup).not.toHaveAttribute('data-nested-drawer-open');

			await waitFor(() => {
				view.detectChanges();
				expect(byTestId('child-popup')).toBeNull();
			});
		} finally {
			disableAnimations();
		}
	});

	it('keeps a fixed height applied while a nested drawer closes', async () => {
		const disableAnimations = enableAnimations();

		try {
			const view = await render(NestedHeightHost);
			await settle(view);

			const parentPopup = byTestId('parent-popup');
			clickButton('Open nested drawer');
			await settle(view);

			await waitFor(() => expect(parentPopup).toHaveAttribute('data-nested-drawer-open', ''));
			await waitFor(() => {
				view.detectChanges();
				expect(parentPopup.style.getPropertyValue('--drawer-height')).not.toBe('');
			});

			const mutations: { hasNested: boolean; drawerHeight: string }[] = [];
			const observer = new MutationObserver(() => {
				mutations.push({
					hasNested: parentPopup.hasAttribute('data-nested-drawer-open'),
					drawerHeight: parentPopup.style.getPropertyValue('--drawer-height'),
				});
			});
			observer.observe(parentPopup, { attributeFilter: ['data-nested-drawer-open', 'style'], attributes: true });

			clickButton('Close nested drawer');
			view.detectChanges();

			await waitFor(() => expect(byTestId('child-popup')).toHaveAttribute('data-ending-style'));
			await waitFor(() => expect(parentPopup).not.toHaveAttribute('data-nested-drawer-open'));
			await waitFor(() => expect(parentPopup.style.getPropertyValue('--drawer-height')).not.toBe(''));
			await waitFor(() =>
				expect(mutations.some((mutation) => !mutation.hasNested && mutation.drawerHeight !== '')).toBe(true),
			);

			observer.disconnect();

			await waitFor(() => {
				view.detectChanges();
				expect(byTestId('child-popup')).toBeNull();
			});
		} finally {
			disableAnimations();
		}
	});

	it('restores a fixed height before nested state when reopening a nested drawer', async () => {
		const disableAnimations = enableAnimations();

		try {
			const view = await render(NestedHeightHost, { inputs: { exitAnimation: false } });
			await settle(view);

			const parentPopup = byTestId('parent-popup');
			clickButton('Open nested drawer');
			await settle(view);
			await waitFor(() => expect(parentPopup).toHaveAttribute('data-nested-drawer-open', ''));

			clickButton('Close nested drawer');
			await settle(view);
			await waitFor(() => expect(parentPopup).not.toHaveAttribute('data-nested-drawer-open'));
			await waitFor(() => {
				view.detectChanges();
				expect(byTestId('child-popup')).toBeNull();
			});

			const mutations: { hasNested: boolean; drawerHeight: string }[] = [];
			const observer = new MutationObserver(() => {
				mutations.push({
					hasNested: parentPopup.hasAttribute('data-nested-drawer-open'),
					drawerHeight: parentPopup.style.getPropertyValue('--drawer-height'),
				});
			});
			observer.observe(parentPopup, { attributeFilter: ['data-nested-drawer-open', 'style'], attributes: true });

			clickButton('Open nested drawer');
			await settle(view);

			await waitFor(() => expect(parentPopup).toHaveAttribute('data-nested-drawer-open', ''));
			await waitFor(() => expect(mutations.find((mutation) => mutation.hasNested)?.drawerHeight).not.toBe(''));
			observer.disconnect();
		} finally {
			disableAnimations();
		}
	});
});
