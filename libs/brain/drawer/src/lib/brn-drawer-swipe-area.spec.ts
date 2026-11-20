import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render, waitFor, type RenderResult } from '@testing-library/angular';
import { userEvent } from '@vitest/browser/context';
import { BrnDrawerImports } from '../index';
import type { BrnDrawerModal, BrnDrawerSwipeDirection } from './brn-drawer';
import { BrnDrawerProvider } from './brn-drawer-provider';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
const nextMacrotask = () => wait(0);

@Component({
	selector: 'brn-drawer-swipe-area-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [modal]="modal()" [restoreFocus]="restoreFocus()">
			<div
				brnDrawerSwipeArea
				[disabled]="disabled()"
				data-testid="swipe-area"
				style="position: fixed; inset-inline: 0; bottom: 0; height: 40px"
			></div>
			<div *brnDrawerPortal brnDrawerViewport style="position: fixed; inset: 0">
				<div brnDrawerPopup data-testid="popup" style="position: fixed; inset-inline: 0; bottom: 0; height: 300px">
					<div brnDrawerContent>Content</div>
				</div>
			</div>
		</div>
		<button data-testid="outside" style="position: fixed; top: 0; left: 0">Outside</button>
	`,
})
class SwipeAreaHost {
	public readonly disabled = input(false);
	public readonly modal = input<boolean>(false);
	public readonly restoreFocus = input(true);
}

/**
 * The host for the tests ported from Base UI. The swipe area covers the top-left corner, where the
 * Base UI gestures start, so the element under the pointer at the gesture start is the swipe area.
 * Spartan only opens a drawer that has a portal, so every drawer renders one.
 */
@Component({
	selector: 'brn-drawer-swipe-area-base-ui-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button data-testid="outside" style="position: fixed; top: 0; right: 0">Outside</button>
		<div brnDrawerProvider>
			<div brnDrawerIndent data-testid="indent"></div>
			<div
				brnDrawer
				[modal]="modal()"
				[swipeDirection]="swipeDirection()"
				[state]="state()"
				[autoFocus]="autoFocus()"
				(stateChanged)="stateChanges.push($event)"
			>
				<div
					brnDrawerSwipeArea
					data-testid="swipe-area"
					[disabled]="disabled()"
					[swipeDirection]="areaSwipeDirection()"
					style="position: fixed; top: 0; left: 0; width: 240px; height: 240px"
				></div>
				<div *brnDrawerPortal brnDrawerViewport style="position: fixed; inset: 0">
					<div brnDrawerPopup data-testid="popup" [class]="popupClass()" [style]="popupStyle()">
						Drawer
						<button brnDrawerClose>Close</button>
					</div>
				</div>
			</div>
		</div>
	`,
})
class BaseUiHost {
	public readonly modal = input<BrnDrawerModal>(true);
	public readonly swipeDirection = input<BrnDrawerSwipeDirection>('down');
	public readonly areaSwipeDirection = input<BrnDrawerSwipeDirection | undefined>(undefined);
	public readonly disabled = input(false);
	public readonly state = input<'open' | 'closed' | null>(null);
	public readonly autoFocus = input<boolean | string>('[data-drawer-popup]');
	public readonly popupClass = input('');
	/** Bound rather than static, like the classes of a styled popup: it applies on change detection. */
	public readonly popupStyle = input('position: fixed; inset-inline: 0; bottom: 0; height: 100px');
	public readonly stateChanges: string[] = [];
}

const swipeArea = () => document.querySelector('[data-testid="swipe-area"]') as HTMLElement;
const popup = () => document.querySelector<HTMLElement>('[data-testid="popup"]');
const backdrop = () => document.querySelector<HTMLElement>('.cdk-overlay-backdrop');
const indent = () => document.querySelector('[data-testid="indent"]') as HTMLElement;
const outsideButton = () => document.querySelector('[data-testid="outside"]') as HTMLButtonElement;

interface PointerInit {
	x: number;
	y: number;
	buttons?: number;
	button?: number;
	pointerType?: string;
	timeStamp?: number;
	cancelable?: boolean;
}

function pointer(target: Element, type: string, x: number, y: number) {
	return firePointer(target, type, { x, y });
}

function firePointer(
	target: Element,
	type: string,
	{ x, y, buttons, button = 0, pointerType = 'mouse', timeStamp, cancelable = true }: PointerInit,
) {
	const event = new PointerEvent(type, {
		bubbles: true,
		cancelable,
		composed: true,
		pointerId: 1,
		pointerType,
		isPrimary: true,
		button,
		buttons: buttons ?? (type === 'pointerup' || type === 'pointercancel' ? 0 : 1),
		clientX: x,
		clientY: y,
	});
	// A fixed timeline keeps the release velocity independent of how fast the runner is.
	if (timeStamp !== undefined) Object.defineProperty(event, 'timeStamp', { value: timeStamp });
	return target.dispatchEvent(event);
}

function fireTouch(target: Element, type: 'touchstart' | 'touchmove' | 'touchend', x: number, y: number) {
	const touch = new Touch({ identifier: 1, target, clientX: x, clientY: y });
	const ended = type === 'touchend';
	target.dispatchEvent(
		new TouchEvent(type, {
			bubbles: true,
			cancelable: true,
			composed: true,
			touches: ended ? [] : [touch],
			targetTouches: ended ? [] : [touch],
			changedTouches: [touch],
		}),
	);
}

function touchEvent(target: Element, type: 'touchstart' | 'touchmove', point: { clientX: number; clientY: number }) {
	const touch = new Touch({ identifier: 1, target, ...point });
	return new TouchEvent(type, {
		bubbles: true,
		cancelable: true,
		composed: true,
		touches: [touch],
		targetTouches: [touch],
		changedTouches: [touch],
	});
}

function click(target: Element, detail = 1) {
	target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, detail }));
}

/** A real outside press always begins with a `pointerdown`, which re-enables outside dismissal. */
function pressOutside(target: Element = document.body) {
	firePointer(target, 'pointerdown', { x: 0, y: 0 });
	firePointer(target, 'pointerup', { x: 0, y: 0 });
	click(target);
}

/** A touch tap dispatches `pointerdown` alongside `touchstart`/`touchend`. */
function pressOutsideTouch(target: Element = document.body) {
	firePointer(target, 'pointerdown', { x: 0, y: 0, pointerType: 'touch' });
	fireTouch(target, 'touchstart', 0, 0);
	fireTouch(target, 'touchend', 0, 0);
	firePointer(target, 'pointerup', { x: 0, y: 0, pointerType: 'touch' });
	click(target);
}

/** Runs change detection and waits a frame, so after-render hooks and observers run. */
async function settle(view: RenderResult<unknown>) {
	view.detectChanges();
	await frame();
	view.detectChanges();
}

interface Point {
	x: number;
	y: number;
}

interface SwipeOptions {
	/** Receives the gesture's timeline so an injected pointer event stays on the same clock. */
	beforeRelease?: (context: { nextTimeStamp: () => number }) => Promise<unknown> | unknown;
	input?: 'pointer' | 'touch';
	pointerType?: 'mouse' | 'pen' | 'touch';
	timeStepMs?: number;
	startTimeMs?: number;
}

/** Mirrors Base UI's `swipe` helper: a press, a 1px step, a move to the end, then the release. */
async function swipe(
	view: RenderResult<unknown>,
	element: Element,
	start: Point,
	end: Point,
	options: SwipeOptions = {},
) {
	const step = {
		x: start.x + (end.x === start.x ? 0 : Math.sign(end.x - start.x)),
		y: start.y + (end.y === start.y ? 0 : Math.sign(end.y - start.y)),
	};
	const { beforeRelease, input = 'pointer', pointerType = 'mouse', timeStepMs = 16, startTimeMs = 1 } = options;

	if (input === 'touch') {
		fireTouch(element, 'touchstart', start.x, start.y);
		await settle(view);
		fireTouch(element, 'touchmove', step.x, step.y);
		await settle(view);
		fireTouch(element, 'touchmove', end.x, end.y);
		await settle(view);
		if (beforeRelease) {
			await beforeRelease({
				nextTimeStamp: () => {
					throw new Error('swipe(): touch events do not carry a synthetic timeline.');
				},
			});
			await settle(view);
		}
		fireTouch(element, 'touchend', end.x, end.y);
		await settle(view);
		return;
	}

	let timeStamp = startTimeMs;
	const nextTimeStamp = () => (timeStamp += timeStepMs);

	firePointer(element, 'pointerdown', { ...start, pointerType, timeStamp });
	await settle(view);
	firePointer(element, 'pointermove', { ...step, pointerType, timeStamp: nextTimeStamp() });
	await settle(view);
	firePointer(element, 'pointermove', { ...end, pointerType, timeStamp: nextTimeStamp() });
	await settle(view);
	if (beforeRelease) {
		await beforeRelease({ nextTimeStamp });
		await settle(view);
	}
	firePointer(element, 'pointerup', { ...end, pointerType, timeStamp: nextTimeStamp() });
	await settle(view);
}

const swipeUp = (view: RenderResult<unknown>, startY: number, endY: number, options?: SwipeOptions) =>
	swipe(view, swipeArea(), { x: 10, y: startY }, { x: 10, y: endY }, options);

const swipeLeft = (view: RenderResult<unknown>, startX: number, endX: number, options?: SwipeOptions) =>
	swipe(view, swipeArea(), { x: startX, y: 10 }, { x: endX, y: 10 }, options);

/** Drags up from the swipe area by `distance`, slowly enough not to count as a flick. */
async function dragUp(distance: number, { release = true } = {}) {
	const area = swipeArea();
	const rect = area.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const startY = rect.top + rect.height / 2;
	const steps = 10;

	pointer(area, 'pointerdown', x, startY);
	for (let step = 1; step <= steps; step++) {
		pointer(area, 'pointermove', x, startY - (distance * step) / steps);
		await wait(30);
	}
	if (!release) return { x, y: startY - distance };

	// Rest before releasing, so the release velocity is zero and only the distance counts.
	await wait(200);
	pointer(area, 'pointerup', x, startY - distance);
	return { x, y: startY - distance };
}

describe('BrnDrawerSwipeArea', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('exposes its state and the opening swipe direction', async () => {
		await render(SwipeAreaHost);
		const area = swipeArea();

		expect(area.getAttribute('role')).toBe('presentation');
		expect(area.getAttribute('aria-hidden')).toBe('true');
		expect(area.hasAttribute('data-closed')).toBe(true);
		expect(area.getAttribute('data-swipe-direction')).toBe('up');
		expect(area.style.touchAction).toBe('pan-x');
	});

	it('opens the drawer while dragging and moves the popup with the pointer', async () => {
		const view = await render(SwipeAreaHost);

		await dragUp(100, { release: false });
		view.detectChanges();
		await frame();

		expect(popup()).toBeTruthy();
		expect(popup()?.hasAttribute('data-swiping')).toBe(true);
		// The popup is 300px tall and dragged 100px open, so 200px of it is still hidden.
		expect(popup()?.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('200px');
		expect(swipeArea().hasAttribute('data-swiping')).toBe(true);
	});

	it('stays open when released past half of the popup', async () => {
		const view = await render(SwipeAreaHost);

		await dragUp(200);
		view.detectChanges();
		await wait(50);

		expect(popup()?.getAttribute('data-state')).toBe('open');
		expect(popup()?.hasAttribute('data-swiping')).toBe(false);
		expect(popup()?.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('');
	});

	it('closes again when released before half of the popup', async () => {
		const view = await render(SwipeAreaHost);

		await dragUp(80);
		view.detectChanges();
		await wait(50);

		expect(popup()?.getAttribute('data-state') ?? 'closed').toBe('closed');
	});

	it('swallows the release click, so the drawer it just opened stays open', async () => {
		const view = await render(SwipeAreaHost);

		const { x, y } = await dragUp(200);
		swipeArea().dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, clientX: x, clientY: y }),
		);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state')).toBe('open');

		// A deliberate outside press afterwards still dismisses the non-modal drawer.
		const outside = document.querySelector('[data-testid="outside"]') as HTMLElement;
		pointer(outside, 'pointerdown', 5, 5);
		pointer(outside, 'pointerup', 5, 5);
		outside.dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, clientX: 5, clientY: 5 }),
		);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state') ?? 'closed').toBe('closed');
	});

	it('lets the click through after a gesture that leaves the drawer closed', async () => {
		const view = await render(SwipeAreaHost);
		const listener = vi.fn();
		document.addEventListener('click', listener);

		const { x, y } = await dragUp(80);
		swipeArea().dispatchEvent(
			new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1, clientX: x, clientY: y }),
		);
		view.detectChanges();
		document.removeEventListener('click', listener);

		expect(listener).toHaveBeenCalledTimes(1);
	});

	it('returns focus without scrolling the page when the drawer closes', async () => {
		const view = await render(SwipeAreaHost);
		const outside = document.querySelector('[data-testid="outside"]') as HTMLButtonElement;
		outside.focus();
		const focus = vi.spyOn(outside, 'focus');

		await dragUp(200);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state')).toBe('open');

		popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		view.detectChanges();
		await wait(100);

		expect(popup()).toBeNull();
		expect(focus).toHaveBeenCalledWith({ preventScroll: true });
		expect(document.activeElement).toBe(outside);
	});

	it('locks the page scroll of a modal drawer only once the opening gesture ends', async () => {
		// The CDK only blocks the scroll of a page that can scroll.
		const filler = document.body.appendChild(document.createElement('div'));
		filler.style.height = '3000px';
		const view = await render(SwipeAreaHost, { inputs: { modal: true } });
		const html = document.documentElement;

		const { x, y } = await dragUp(200, { release: false });
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state')).toBe('open');
		expect(html.classList).not.toContain('cdk-global-scrollblock');

		await wait(200);
		pointer(swipeArea(), 'pointerup', x, y);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state')).toBe('open');
		expect(html.classList).toContain('cdk-global-scrollblock');

		popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		view.detectChanges();
		await wait(100);
		expect(html.classList).not.toContain('cdk-global-scrollblock');
		filler.remove();
	});

	it('cancels native scrolling for touch moves along the swipe axis only', async () => {
		const view = await render(SwipeAreaHost);
		view.detectChanges();
		const area = swipeArea();
		const { left, top } = area.getBoundingClientRect();
		const start = { clientX: left + 20, clientY: top + 20 };

		area.dispatchEvent(touchEvent(area, 'touchstart', start));
		const sideways = touchEvent(area, 'touchmove', { clientX: start.clientX + 12, clientY: start.clientY - 2 });
		area.dispatchEvent(sideways);
		expect(sideways.defaultPrevented).toBe(false);

		area.dispatchEvent(touchEvent(area, 'touchstart', start));
		const upward = touchEvent(area, 'touchmove', { clientX: start.clientX + 2, clientY: start.clientY - 12 });
		area.dispatchEvent(upward);
		expect(upward.defaultPrevented).toBe(true);
	});

	it('does not return focus when the drawer closes with restoreFocus false', async () => {
		const view = await render(SwipeAreaHost, { inputs: { restoreFocus: false } });
		const outside = document.querySelector('[data-testid="outside"]') as HTMLButtonElement;
		outside.focus();
		const focus = vi.spyOn(outside, 'focus');

		await dragUp(200);
		view.detectChanges();
		await wait(50);
		expect(popup()?.getAttribute('data-state')).toBe('open');
		outside.blur();

		popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		view.detectChanges();
		await wait(100);

		expect(popup()).toBeNull();
		expect(focus).not.toHaveBeenCalled();
	});

	it('does not open the drawer when disabled', async () => {
		const view = await render(SwipeAreaHost, { inputs: { disabled: true } });

		expect(swipeArea().hasAttribute('data-disabled')).toBe(true);
		expect(swipeArea().style.pointerEvents).toBe('none');
		await dragUp(200);
		view.detectChanges();
		await wait(50);

		expect(popup()).toBeNull();
		expect(swipeArea().hasAttribute('data-closed')).toBe(true);
	});

	// Ported from Base UI's DrawerSwipeArea.test.tsx.

	it('opens the drawer when swiped in the open direction', async () => {
		const view = await render(BaseUiHost);

		expect(swipeArea()).toHaveAttribute('data-closed', '');

		await swipeUp(view, 120, 40);

		expect(swipeArea()).toHaveAttribute('data-open', '');
	});

	it('does not open when the swipe direction never locks to the open direction', async () => {
		const view = await render(BaseUiHost);

		await swipe(view, swipeArea(), { x: 10, y: 120 }, { x: 70, y: 118 });

		expect(swipeArea()).toHaveAttribute('data-closed', '');
		expect(view.fixture.componentInstance.stateChanges).toEqual([]);
	});

	it('prevents default pointer down for non-touch swipes', async () => {
		await render(BaseUiHost);

		const notCancelled = firePointer(swipeArea(), 'pointerdown', { x: 10, y: 120 });

		expect(notCancelled).toBe(false);
	});

	it('respects custom swipeDirection', async () => {
		const view = await render(BaseUiHost, { inputs: { areaSwipeDirection: 'left' } });

		await swipeLeft(view, 120, 40);

		expect(swipeArea()).toHaveAttribute('data-open', '');
	});

	it('synchronizes overshoot styles across the popup, backdrop, and provider indent', async () => {
		const view = await render(BaseUiHost, {
			inputs: {
				areaSwipeDirection: 'left',
				popupStyle: 'position: fixed; right: 0; bottom: 0; width: 100px; height: 100px',
			},
		});

		await swipeLeft(view, 200, -50, {
			async beforeRelease({ nextTimeStamp }) {
				const popupElement = popup() as HTMLElement;
				const backdropElement = backdrop() as HTMLElement;

				// 250px of travel against a 100px popup: the 150px overshoot is damped to its square root.
				expect(Number.parseFloat(popupElement.style.getPropertyValue('--drawer-swipe-movement-x'))).toBeCloseTo(
					-Math.sqrt(150),
				);
				expect(popupElement.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('0px');
				expect(popupElement.style.transition).toBe('none');
				expect(backdropElement).toHaveAttribute('data-swiping', '');
				expect(backdropElement.style.getPropertyValue('--drawer-height')).toBe('100px');
				expect(indent().style.getPropertyValue('--drawer-swipe-progress')).toBe('1');
				expect(indent().style.getPropertyValue('--drawer-height')).toBe('100px');

				firePointer(swipeArea(), 'pointermove', { x: 200, y: 0, timeStamp: nextTimeStamp() });
				await settle(view);
				expect(indent().style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
				expect(indent().style.getPropertyValue('--drawer-height')).toBe('');

				firePointer(swipeArea(), 'pointermove', { x: -50, y: 0, timeStamp: nextTimeStamp() });
				await settle(view);
			},
		});

		expect(backdrop()).not.toHaveAttribute('data-swiping');
		expect(backdrop()?.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent().style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent().style.getPropertyValue('--drawer-height')).toBe('');
	});

	it('opens from the rendered transform distance in either horizontal direction', async () => {
		const view = await render(BaseUiHost, {
			inputs: {
				swipeDirection: 'left',
				areaSwipeDirection: 'right',
				popupStyle:
					'position: fixed; left: 0; top: 0; width: 100px; height: 100px; transform: matrix(1, 0, 0, 1, 60, 0)',
			},
		});

		await swipe(
			view,
			swipeArea(),
			{ x: 0, y: 10 },
			{ x: 40, y: 10 },
			{
				beforeRelease() {
					// The popup is rendered 60px from closed, not its full 100px width: 60 - 40 = 20px remain.
					expect(Number.parseFloat(popup()?.style.getPropertyValue('--drawer-swipe-movement-x') ?? '')).toBeCloseTo(
						-20,
					);
				},
			},
		);

		expect(swipeArea()).toHaveAttribute('data-open', '');
	});

	it('omits frontmost height when an opening drawer has no measured height', async () => {
		const view = await render(BaseUiHost, {
			inputs: {
				areaSwipeDirection: 'left',
				popupStyle: 'position: fixed; right: 0; bottom: 0; width: 100px; height: 0; overflow: hidden',
			},
		});

		await swipeLeft(view, 100, 40, {
			beforeRelease() {
				expect(backdrop()?.style.getPropertyValue('--drawer-height')).toBe('');
				expect(indent().style.getPropertyValue('--drawer-height')).toBe('');
			},
		});
	});

	it('cancels an active opening gesture when the swipe area becomes disabled', async () => {
		const view = await render(BaseUiHost);
		const provider = view.fixture.debugElement.query(By.directive(BrnDrawerProvider)).injector.get(BrnDrawerProvider);

		firePointer(swipeArea(), 'pointerdown', { x: 0, y: 100 });
		firePointer(swipeArea(), 'pointermove', { x: 0, y: 99 });
		firePointer(swipeArea(), 'pointermove', { x: 0, y: 60 });
		await settle(view);
		expect(popup()).toHaveAttribute('data-swiping', '');

		const setVisualState = vi.spyOn(provider.visualStateStore, 'set');
		view.fixture.componentRef.setInput('disabled', true);
		view.detectChanges();

		// The gesture is torn down within the change detection that disables the swipe area.
		expect(setVisualState).toHaveBeenCalledWith(expect.objectContaining({ swipeProgress: 0 }));
		expect(popup()).not.toHaveAttribute('data-swiping');
		expect(swipeArea()).toHaveAttribute('data-disabled', '');

		pressOutside();

		await waitFor(() => expect(popup()).toBeNull());
	});

	it('keeps the drawer open when the release click follows a mid-gesture disable', async () => {
		const view = await render(BaseUiHost);

		firePointer(swipeArea(), 'pointerdown', { x: 0, y: 100 });
		firePointer(swipeArea(), 'pointermove', { x: 0, y: 99 });
		firePointer(swipeArea(), 'pointermove', { x: 0, y: 40 });
		await settle(view);
		expect(popup()).toHaveAttribute('data-open', '');

		view.fixture.componentRef.setInput('disabled', true);
		await settle(view);

		// The pointer is still down when `disabled` flips, so the gesture's eventual release
		// synthesizes a click with no fresh `pointerdown`. It must not dismiss the drawer.
		click(document.body);
		await nextMacrotask();
		await settle(view);

		expect(popup()).toHaveAttribute('data-open', '');

		pressOutside();

		await waitFor(() => expect(popup()).toBeNull());
	});

	it('does not prevent a non-cancelable pointer start', async () => {
		const view = await render(BaseUiHost);
		const event = new PointerEvent('pointerdown', {
			bubbles: true,
			cancelable: false,
			pointerId: 1,
			pointerType: 'mouse',
			button: 0,
			buttons: 1,
			clientX: 0,
			clientY: 0,
		});
		const preventDefault = vi.spyOn(event, 'preventDefault');

		const dispatched = swipeArea().dispatchEvent(event);
		await settle(view);

		expect(dispatched).toBe(true);
		expect(event.defaultPrevented).toBe(false);
		expect(preventDefault).not.toHaveBeenCalled();

		firePointer(swipeArea(), 'pointercancel', { x: 0, y: 0 });
		await settle(view);
	});

	it('ignores compatibility touch pointer gestures with real displacement', async () => {
		const view = await render(BaseUiHost);
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 0, y: 120, pointerType: 'touch' });
		firePointer(area, 'pointermove', { x: 0, y: 40, pointerType: 'touch' });
		firePointer(area, 'pointerup', { x: 0, y: 40, pointerType: 'touch' });
		firePointer(area, 'pointercancel', { x: 0, y: 40, pointerType: 'touch' });
		await settle(view);
		expect(view.fixture.componentInstance.stateChanges).toEqual([]);

		firePointer(area, 'pointerdown', { x: 10, y: 120 });
		firePointer(area, 'pointercancel', { x: 10, y: 120 });
		await settle(view);

		expect(area).toHaveAttribute('data-closed', '');
		expect(area).not.toHaveAttribute('data-swiping');
	});

	it('opens the drawer when swiped with touch events', async () => {
		const view = await render(BaseUiHost);

		await swipeUp(view, 120, 40, { input: 'touch' });

		expect(swipeArea()).toHaveAttribute('data-open', '');
		expect(popup()).toHaveAttribute('data-open', '');
	});

	it('applies data-swiping during an active swipe gesture', async () => {
		const view = await render(BaseUiHost);

		await swipeUp(view, 120, 40, {
			beforeRelease() {
				expect(swipeArea()).toHaveAttribute('data-swiping', '');
			},
		});

		expect(swipeArea()).not.toHaveAttribute('data-swiping');
	});

	it('re-enables outside press dismissal after opening by swipe', async () => {
		const view = await render(BaseUiHost);

		await swipeUp(view, 120, 40, { input: 'touch' });
		expect(popup()).toHaveAttribute('data-open', '');
		await nextMacrotask();

		pressOutside();

		await waitFor(() => expect(popup()).toBeNull());
		expect(swipeArea()).toHaveAttribute('data-closed', '');
	});

	it('re-enables outside press dismissal for a touch outside press after opening by swipe', async () => {
		const view = await render(BaseUiHost);

		await swipeUp(view, 120, 40, { input: 'touch' });
		expect(popup()).toHaveAttribute('data-open', '');
		await nextMacrotask();

		// A touch outside press fires `pointerdown` alongside `touchstart`/`touchend`, so it
		// re-enables dismissal and closes the swipe-opened drawer the same way a mouse press does.
		pressOutsideTouch();

		await waitFor(() => expect(popup()).toBeNull());
		expect(swipeArea()).toHaveAttribute('data-closed', '');
	});

	it.each([
		{ input: 'pointer' as const, pointerType: 'mouse' as const },
		{ input: 'pointer' as const, pointerType: 'pen' as const },
		{ input: 'touch' as const, pointerType: 'touch' as const },
	])(
		'does not dismiss from the $pointerType/$input click synthesized by the swipe-open release',
		async ({ input, pointerType }) => {
			// Dragging past the popup releases the pointer outside it, so the gesture's own pointerup
			// synthesizes a `click` there. That click has no fresh pointerdown and must not dismiss the
			// drawer that was just opened, even when it lands a macrotask later.
			const view = await render(BaseUiHost);

			await swipeUp(view, 120, 40, { input, pointerType });
			expect(popup()).toHaveAttribute('data-open', '');
			await nextMacrotask();

			click(document.body);
			await nextMacrotask();
			await settle(view);

			expect(popup()).toHaveAttribute('data-open', '');
		},
	);

	it('suppresses a trusted release click that arrives without a preceding pointerdown', async () => {
		// Browsers deliver the gesture's trailing click without a fresh `pointerdown` (e.g. a touch
		// flick within tap slop). Trusted input can't produce that shape directly, so the
		// `pointerdown` is stopped at the window, ahead of document capture.
		const view = await render(BaseUiHost);
		const stopPointerDown = (event: Event) => event.stopPropagation();

		try {
			// The synthetic swipe opens the drawer and arms the release guard without a trailing click.
			await swipeUp(view, 120, 40);
			expect(popup()).toHaveAttribute('data-open', '');

			window.addEventListener('pointerdown', stopPointerDown, true);
			// `force` skips the actionability check: the backdrop intercepts the click, which is
			// exactly where a release click lands.
			await userEvent.click(outsideButton(), { force: true });
			window.removeEventListener('pointerdown', stopPointerDown, true);
			await nextMacrotask();
			await settle(view);

			expect(popup()).toHaveAttribute('data-open', '');

			// The guard is consumed, so a deliberate outside press now dismisses.
			await userEvent.click(outsideButton(), { force: true });

			await waitFor(() => expect(popup()).toBeNull());
		} finally {
			window.removeEventListener('pointerdown', stopPointerDown, true);
		}
	});

	it('allows a later click-only activation to dismiss after a swipe', async () => {
		const view = await render(BaseUiHost, { inputs: { modal: false, autoFocus: false } });
		const outside = outsideButton();
		outside.focus();

		await swipeUp(view, 120, 40);
		expect(popup()).toHaveAttribute('data-open', '');
		expect(outside).toHaveFocus();

		await userEvent.keyboard('{Enter}');

		await waitFor(() => expect(popup()).toBeNull());
	});

	it('allows a later pointerless virtual click to dismiss when the release has no click', async () => {
		const view = await render(BaseUiHost, { inputs: { modal: false, autoFocus: false } });

		await swipeUp(view, 120, 40, { input: 'touch' });
		expect(popup()).toHaveAttribute('data-open', '');

		// A virtual click (assistive tech) has no pointer and a `detail` of 0. Base UI forces its
		// `isVirtualClick` check with a mock; spartan reads the `detail` of a real one.
		click(outsideButton(), 0);

		await waitFor(() => expect(popup()).toBeNull());
	});

	it('re-enables outside press dismissal after an interrupted swipe-open gesture', async () => {
		const view = await render(BaseUiHost);
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 10, y: 120 });
		await settle(view);
		firePointer(area, 'pointermove', { x: 10, y: 119 });
		await settle(view);
		firePointer(area, 'pointermove', { x: 10, y: 80 });
		await settle(view);

		expect(popup()).toHaveAttribute('data-open', '');
		expect(area).toHaveAttribute('data-open', '');

		// A secondary button taking over the gesture cancels it.
		firePointer(area, 'pointermove', { x: 10, y: 60, buttons: 2 });
		await settle(view);
		await nextMacrotask();

		pressOutside();

		await waitFor(() => expect(popup()).toBeNull());
		expect(area).toHaveAttribute('data-closed', '');
	});

	it('re-enables outside press dismissal after a context menu interrupts swipe-open', async () => {
		const view = await render(BaseUiHost);
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 10, y: 120 });
		await settle(view);
		firePointer(area, 'pointermove', { x: 10, y: 119 });
		await settle(view);
		firePointer(area, 'pointermove', { x: 10, y: 80 });
		await settle(view);

		expect(popup()).toHaveAttribute('data-open', '');

		firePointer(area, 'pointermove', { x: 10, y: 60, buttons: 2 });
		await settle(view);
		area.dispatchEvent(
			new MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2, clientX: 10, clientY: 60 }),
		);
		await nextMacrotask();
		await settle(view);

		pressOutside();

		await waitFor(() => expect(popup()).toBeNull());
	});

	it('uses a size-based swipe threshold by default', async () => {
		const view = await render(BaseUiHost, {
			inputs: { popupStyle: 'position: fixed; inset-inline: 0; bottom: 0; height: 200px' },
		});
		// Step past the flick-velocity window (80ms) so the distance decides the outcome.
		const slowSwipe = { timeStepMs: 100 };

		// 70px is below half of the 200px popup.
		await swipeUp(view, 200, 130, slowSwipe);
		await waitFor(() => expect(popup()).toBeNull());
		expect(swipeArea()).toHaveAttribute('data-closed', '');

		// 120px is past half of it.
		await swipeUp(view, 200, 80, slowSwipe);
		expect(swipeArea()).toHaveAttribute('data-open', '');
	});

	it('keeps the swipe-area movement on the popup when re-grabbed during close', async () => {
		// The viewport's open reset would zero the movement vars on the render that reopens the drawer
		// and flash the popup fully open for a frame. That only shows on a re-grab, while the exit
		// animation keeps the popup mounted.
		const style = document.createElement('style');
		// Beats the global test setup that disables animations.
		style.textContent = `
			@keyframes swipe-regrab-exit {
				to {
					opacity: 0;
				}
			}

			[data-testid='popup'].swipe-regrab-popup[data-ending-style] {
				animation: swipe-regrab-exit 200ms !important;
			}
		`;
		document.head.appendChild(style);

		try {
			const view = await render(BaseUiHost, {
				inputs: {
					popupClass: 'swipe-regrab-popup',
					popupStyle: 'position: fixed; inset-inline: 0; bottom: 0; height: 200px',
				},
			});
			const area = swipeArea();

			await swipeUp(view, 220, 20);
			expect(area).toHaveAttribute('data-open', '');

			const popupElement = popup() as HTMLElement;

			// Begin closing; the exit animation keeps the popup mounted while it plays.
			(popupElement.querySelector('[brnDrawerClose]') as HTMLButtonElement).click();
			await waitFor(() => expect(popupElement).toHaveAttribute('data-ending-style'));

			// Re-grab mid-exit: one move locks the direction, reopens the drawer and writes the movement
			// (200 - 80 = 120px of remaining travel) on the render that reopens it.
			firePointer(area, 'pointerdown', { x: 10, y: 120 });
			await settle(view);
			firePointer(area, 'pointermove', { x: 10, y: 40 });
			await settle(view);

			expect(area).toHaveAttribute('data-open', '');
			expect(popupElement.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('120px');
		} finally {
			style.remove();
		}
	});

	it('opens on a quick flick whose only move is already released (buttons: 0)', async () => {
		// On a fast flick the pointer can be lifted before the first `pointermove` is sampled, so the
		// single move arrives with `buttons: 0`. It must still commit the swipe-open.
		const view = await render(BaseUiHost);
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 10, y: 120, timeStamp: 1 });
		await settle(view);
		firePointer(area, 'pointermove', { x: 10, y: 40, buttons: 0, timeStamp: 16 });
		await settle(view);

		// No trailing `pointerup` follows; the released move finishes the gesture by itself.
		expect(area).toHaveAttribute('data-open', '');
		expect(area).not.toHaveAttribute('data-swiping');

		pressOutside();

		await waitFor(() => expect(popup()).toBeNull());
	});

	it('commits a released-move quick flick exactly once when a real pointerup trails it', async () => {
		const view = await render(BaseUiHost);
		const { stateChanges } = view.fixture.componentInstance;
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 10, y: 120, timeStamp: 1 });
		await settle(view);
		firePointer(area, 'pointermove', { x: 10, y: 40, buttons: 0, timeStamp: 16 });
		await settle(view);

		expect(area).toHaveAttribute('data-open', '');
		expect(stateChanges).toEqual(['open']);

		// The trailing `pointerup` a real browser still delivers must not re-run the release.
		firePointer(area, 'pointerup', { x: 10, y: 40, timeStamp: 32 });
		await settle(view);

		expect(area).toHaveAttribute('data-open', '');
		expect(area).not.toHaveAttribute('data-swiping');
		expect(stateChanges).toEqual(['open']);
	});

	it('opens on a quick flick that lands its whole travel in a single touch move', async () => {
		const view = await render(BaseUiHost);
		const area = swipeArea();

		fireTouch(area, 'touchstart', 10, 120);
		await settle(view);
		fireTouch(area, 'touchmove', 10, 40);
		await settle(view);
		fireTouch(area, 'touchend', 10, 40);
		await settle(view);

		expect(area).toHaveAttribute('data-open', '');
	});

	it('does not open on an in-place press-release without movement', async () => {
		const view = await render(BaseUiHost);
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 10, y: 120, timeStamp: 1 });
		await settle(view);
		// Released in place: a `buttons: 0` move without displacement must not open the drawer.
		firePointer(area, 'pointermove', { x: 10, y: 120, buttons: 0, timeStamp: 16 });
		await settle(view);
		firePointer(area, 'pointerup', { x: 10, y: 120, timeStamp: 32 });
		await settle(view);

		expect(area).toHaveAttribute('data-closed', '');
		expect(view.fixture.componentInstance.stateChanges).toEqual([]);
	});

	it('does not open a horizontal drawer on a stationary pointer move', async () => {
		const view = await render(BaseUiHost, { inputs: { areaSwipeDirection: 'left' } });
		const area = swipeArea();

		firePointer(area, 'pointerdown', { x: 100, y: 10 });
		firePointer(area, 'pointermove', { x: 100, y: 10 });
		await settle(view);
		expect(view.fixture.componentInstance.stateChanges).toEqual([]);

		firePointer(area, 'pointerup', { x: 100, y: 10 });
		await settle(view);
		expect(view.fixture.componentInstance.stateChanges).toEqual([]);
	});
});
