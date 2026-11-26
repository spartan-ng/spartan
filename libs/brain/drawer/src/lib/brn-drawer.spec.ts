import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, inject, input, model, PLATFORM_ID, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { render, type ComponentInput } from '@testing-library/angular';
import { BrnDrawerImports, type BrnDrawerSnapPoint } from '../index';
import { BrnDrawer, type BrnDrawerSwipeDirection } from './brn-drawer';
import { BrnDrawerProvider } from './brn-drawer-provider';
import { BrnDrawerTrigger } from './brn-drawer-trigger';

type RenderResult = Awaited<ReturnType<typeof render>>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));

const byTestId = (id: string) => document.querySelector(`[data-testid="${id}"]`) as HTMLElement;
const byText = (selector: string, text: string) =>
	Array.from(document.querySelectorAll<HTMLElement>(selector)).find(
		(el) => el.textContent?.trim() === text,
	) as HTMLElement;
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');

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

async function settle(view: RenderResult, ms = 50) {
	view.detectChanges();
	await wait(ms);
	view.detectChanges();
}

function getDrawer(view: RenderResult, testId?: string): BrnDrawer {
	const debugElement = testId
		? view.fixture.debugElement.query(By.css(`[data-testid="${testId}"]`))
		: view.fixture.debugElement.query(By.directive(BrnDrawer));
	return debugElement.injector.get(BrnDrawer);
}

interface TimedSwipeStep {
	type: 'down' | 'move' | 'up';
	x: number;
	y: number;
	/** The event `timeStamp`. Omitted, the event keeps the real one. */
	time?: number;
}

function firePointer(target: Element, step: TimedSwipeStep) {
	const type = { down: 'pointerdown', move: 'pointermove', up: 'pointerup' }[step.type];
	const event = new PointerEvent(type, {
		bubbles: true,
		cancelable: true,
		composed: true,
		pointerId: 1,
		pointerType: 'mouse',
		isPrimary: true,
		button: 0,
		buttons: step.type === 'up' ? 0 : 1,
		clientX: step.x,
		clientY: step.y,
	});
	if (step.time !== undefined) Object.defineProperty(event, 'timeStamp', { value: step.time });
	target.dispatchEvent(event);
}

/**
 * Every step carries its own `timeStamp`, so the gesture's timeline doesn't depend on the wall
 * clock. The swipe reads velocities from the event timestamps only.
 */
async function simulateTimedSwipe(element: Element, steps: TimedSwipeStep[]) {
	for (const step of steps) {
		firePointer(element, step);
		await Promise.resolve();
	}
}

async function simulateTimedRightSwipe(
	element: Element,
	startX: number,
	endX: number,
	startTime: number,
	moveTime: number,
	endTime: number,
) {
	await simulateTimedSwipe(element, [
		{ type: 'down', x: startX, y: 100, time: startTime },
		{ type: 'move', x: startX + 1, y: 100, time: moveTime },
		{ type: 'move', x: endX, y: 100, time: endTime - 1 },
		{ type: 'up', x: endX, y: 100, time: endTime },
	]);
}

async function simulateTimedDownSwipe(
	element: Element,
	startY: number,
	endY: number,
	startTime: number,
	moveTime: number,
	endTime: number,
	settleTime?: number,
) {
	await simulateTimedSwipe(element, [
		{ type: 'down', x: 100, y: startY, time: startTime },
		{ type: 'move', x: 100, y: startY + 1, time: moveTime },
		...(settleTime !== undefined ? [{ type: 'move' as const, x: 100, y: endY - 1, time: settleTime }] : []),
		{ type: 'move', x: 100, y: endY, time: endTime - 1 },
		{ type: 'up', x: 100, y: endY, time: endTime },
	]);
}

const SNAP_POINTS: BrnDrawerSnapPoint[] = ['100px', '300px', 1];

/** A controlled drawer (`state` follows `stateChanged`) with configurable swipe and snap point inputs. */
@Component({
	selector: 'brn-drawer-swipe-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnDrawer
			[state]="open() ? 'open' : 'closed'"
			(stateChanged)="onStateChanged($event)"
			[swipeDirection]="swipeDirection()"
			[snapPoints]="snapPoints()"
			[defaultSnapPoint]="defaultSnapPoint()"
			[(snapPoint)]="snapPoint"
			[snapToSequentialPoints]="snapToSequentialPoints()"
			[disableClose]="disableClose()"
		>
			<div *brnDrawerPortal brnDrawerViewport data-testid="viewport" [style.height.px]="viewportHeight()">
				<div brnDrawerPopup data-testid="popup" [style.height.px]="popupHeight()" [style.width.px]="popupWidth()">
					Drawer
				</div>
			</div>
		</div>
	`,
})
class SwipeHost {
	public readonly open = model(true);
	public readonly snapPoint = model<BrnDrawerSnapPoint | null | undefined>(undefined);
	public readonly swipeDirection = input<BrnDrawerSwipeDirection>('down');
	public readonly snapPoints = input<BrnDrawerSnapPoint[] | undefined>(undefined);
	public readonly defaultSnapPoint = input<BrnDrawerSnapPoint | null | undefined>(undefined);
	public readonly snapToSequentialPoints = input(false);
	/** Rejects the swipe dismissal, the spartan equivalent of a canceled `onOpenChange`. */
	public readonly disableClose = input(false);
	public readonly viewportHeight = input<number | null>(null);
	public readonly popupHeight = input<number | null>(null);
	public readonly popupWidth = input<number | null>(null);

	public readonly stateChanges = vi.fn();

	protected onStateChanged(state: BrnDialogState) {
		this.stateChanges(state);
		this.open.set(state === 'open');
	}
}

@Component({
	selector: 'brn-drawer-uncontrolled-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer swipeDirection="down">
			<div *brnDrawerPortal brnDrawerViewport data-testid="viewport">
				<div brnDrawerPopup data-testid="popup" style="height: 200px">Drawer</div>
			</div>
		</div>
	`,
})
class UncontrolledHost {}

@Component({
	selector: 'brn-drawer-borrowed-parts-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [modal]="false">
			<button brnDrawerTrigger>Open</button>
			<button brnDrawerTrigger disabled>Disabled</button>
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup>
					<button brnDrawerClose disabled>Close</button>
				</div>
			</div>
		</div>
	`,
})
class BorrowedPartsHost {}

@Component({
	selector: 'brn-drawer-detached-triggers-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div>
			<button id="trigger-1" [brnDrawerTriggerFor]="drawer" [payload]="1">Trigger 1</button>
			<button id="trigger-2" [brnDrawerTriggerFor]="drawer" [payload]="2">Trigger 2</button>
			<div brnDrawer #drawer="brnDrawer">
				<div *brnDrawerPortal brnDrawerViewport>
					<div brnDrawerPopup data-testid="content">
						<span data-testid="payload">{{ drawer.payload() }}</span>
						<button brnDrawerClose>Close</button>
					</div>
				</div>
			</div>
		</div>
	`,
})
class DetachedTriggersHost {}

@Component({
	selector: 'brn-drawer-aria-controls-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer>
			<button brnDrawerTrigger>Open</button>
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup data-testid="popup">Drawer</div>
			</div>
		</div>
	`,
})
class AriaControlsHost {}

@Component({
	selector: 'brn-drawer-snap-reset-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnDrawer
			[state]="open() ? 'open' : 'closed'"
			(stateChanged)="open.set($event === 'open')"
			[snapPoints]="_snapPoints"
			[defaultSnapPoint]="defaultSnapPoint()"
			[(snapPoint)]="snapPoint"
		>
			<div *brnDrawerPortal brnDrawerViewport data-testid="viewport">
				<div brnDrawerPopup data-testid="popup">
					Drawer
					<button brnDrawerClose data-testid="close">Close</button>
				</div>
			</div>
		</div>
	`,
})
class SnapPointResetHost {
	protected readonly _snapPoints = SNAP_POINTS;
	public readonly open = signal(true);
	public readonly snapPoint = model<BrnDrawerSnapPoint | null | undefined>(undefined);
	public readonly defaultSnapPoint = input<BrnDrawerSnapPoint | null | undefined>(undefined);
}

@Component({
	selector: 'brn-drawer-invalid-snap-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			brnDrawer
			defaultSnapPoint="300px"
			[snapPoints]="['100px', '300px']"
			(snapPointChange)="snapPointChanges($event)"
		></div>
	`,
})
class InvalidSnapPointHost {
	public readonly snapPointChanges = vi.fn();
}

@Component({
	selector: 'brn-drawer-nested-progress-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer data-testid="parent">
			<div brnDrawer data-testid="child"></div>
		</div>
	`,
})
class NestedSwipeProgressHost {}

@Component({
	selector: 'brn-drawer-provider-registration-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawerProvider>
			@if (showDrawer()) {
				<div brnDrawer [modal]="false" [state]="controlled() ? 'open' : null">
					<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Drawer</div></div>
				</div>
			}
			<div brnDrawerIndentBackground data-testid="background"></div>
		</div>
	`,
})
class ProviderRegistrationHost {
	public readonly showDrawer = input(true);
	public readonly controlled = input(true);
}

@Component({
	selector: 'brn-drawer-close-watcher-host',
	imports: [BrnDrawerImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnDrawer [disableClose]="disableClose()" (stateChanged)="stateChanges($event)">
			<div *brnDrawerPortal brnDrawerViewport>
				<div brnDrawerPopup>Drawer</div>
			</div>
		</div>
	`,
})
class CloseWatcherHost {
	/** Rejects the close request, the spartan equivalent of canceling `onOpenChange`. */
	public readonly disableClose = input(false);
	public readonly stateChanges = vi.fn();
}

describe('BrnDrawer', () => {
	const originalElementFromPoint = document.elementFromPoint;

	/** Points `elementFromPoint` at the given element, so a swipe starts wherever it is dispatched. */
	function pointAt(element: Element) {
		document.elementFromPoint = () => element;
	}

	afterEach(() => {
		document.elementFromPoint = originalElementFromPoint;
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	/** Renders the swipe host open, with `elementFromPoint` aimed at its popup. */
	async function renderSwipeHost(inputs: ComponentInput<SwipeHost>) {
		const view = await render(SwipeHost, { inputs });
		await settle(view);
		pointAt(byTestId('popup'));
		const host = view.fixture.componentInstance;
		host.stateChanges.mockClear();
		return { view, host, viewport: byTestId('viewport'), popup: byTestId('popup') };
	}

	async function expectRemoved(view: RenderResult, testId: string) {
		await waitFor(() => {
			view.detectChanges();
			expect(byTestId(testId)).toBeNull();
		});
	}

	it('exposes the attributes rendered by borrowed trigger and close parts', async () => {
		const view = await render(BorrowedPartsHost);

		const disabledTrigger = byText('button', 'Disabled');
		expect(disabledTrigger).toHaveAttribute('data-disabled');

		const trigger = byText('button', 'Open');
		trigger.click();
		await settle(view);

		const closeButton = byText('button', 'Close');
		expect(closeButton).toHaveAttribute('data-disabled');
		// spartan reports the open popup on the trigger as `data-state="open"`.
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('uses a size-based swipe threshold', async () => {
		const { view, host, viewport } = await renderSwipeHost({ swipeDirection: 'right', popupWidth: 200 });

		const startTime = 1000;
		const moveTime = 1100;
		const endTime = 1600;

		await simulateTimedRightSwipe(viewport, 100, 190, startTime, moveTime, endTime);
		view.detectChanges();
		expect(host.stateChanges).not.toHaveBeenCalled();

		await simulateTimedRightSwipe(viewport, 100, 220, startTime + 1000, moveTime + 1000, endTime + 1000);
		view.detectChanges();
		expect(host.stateChanges).toHaveBeenCalledWith('closed');
	});

	it('supports detached triggers with handles', async () => {
		const view = await render(DetachedTriggersHost);

		expect(byTestId('payload')).toBeNull();

		byText('button', 'Trigger 1').click();
		await settle(view);
		expect(byTestId('payload').textContent).toBe('1');

		byText('button', 'Close').click();
		await expectRemoved(view, 'payload');

		byText('button', 'Trigger 2').click();
		await settle(view);
		expect(byTestId('payload').textContent).toBe('2');
	});

	it('supports imperative actions with handles', async () => {
		const view = await render(DetachedTriggersHost);
		const drawer = getDrawer(view);
		const [trigger1, trigger2] = view.fixture.debugElement
			.queryAll(By.directive(BrnDrawerTrigger))
			.map((debugElement) => debugElement.nativeElement as HTMLElement);
		expect(dialog()).toBeNull();

		// The spartan equivalent of `handle.open('trigger-2')`.
		view.fixture.debugElement.queryAll(By.directive(BrnDrawerTrigger))[1].injector.get(BrnDrawerTrigger).open();
		await settle(view);
		await waitFor(() => expect(dialog()).not.toBeNull());

		expect(byTestId('content').textContent).toContain('2');
		expect(trigger2).toHaveAttribute('aria-expanded', 'true');
		expect(trigger2.getAttribute('aria-controls')).toBe(dialog()?.getAttribute('id'));
		expect(trigger1).toHaveAttribute('aria-expanded', 'false');

		drawer.close();
		await waitFor(() => {
			view.detectChanges();
			expect(dialog()).toBeNull();
		});
		expect(trigger2).toHaveAttribute('aria-expanded', 'false');

		// The spartan equivalent of `handle.openWithPayload(8)`.
		drawer.payload.set(8);
		drawer.open();
		await settle(view);
		await waitFor(() => expect(dialog()).not.toBeNull());
		expect(byTestId('content').textContent).toContain('8');
		expect(trigger1).toHaveAttribute('aria-expanded', 'false');
		expect(trigger2).toHaveAttribute('aria-expanded', 'false');
	});

	it('synchronizes trigger aria-controls with the popup id', async () => {
		const view = await render(AriaControlsHost);

		const trigger = byText('button', 'Open');
		trigger.click();
		await settle(view);
		await waitFor(() => expect(dialog()).not.toBeNull());

		// The CDK dialog container is the `role="dialog"` element that wraps the popup.
		const popupDialog = byTestId('popup').closest('[role="dialog"]');
		expect(popupDialog).not.toBeNull();
		expect(trigger.getAttribute('aria-controls')).toBe(popupDialog?.getAttribute('id'));
	});

	it('resets the active snap point when closing', async () => {
		const view = await render(SnapPointResetHost, { inputs: { snapPoint: SNAP_POINTS[2] } });
		await settle(view);

		byTestId('close').click();
		view.detectChanges();

		expect(String(view.fixture.componentInstance.snapPoint())).toBe('100px');
	});

	it('resets to the default snap point when provided', async () => {
		const view = await render(SnapPointResetHost, { inputs: { defaultSnapPoint: SNAP_POINTS[1] } });
		await settle(view);
		const drawer = getDrawer(view);

		expect(String(drawer.activeSnapPoint())).toBe('300px');

		byTestId('close').click();
		view.detectChanges();

		expect(String(drawer.activeSnapPoint())).toBe('300px');
	});

	it('falls back from invalid uncontrolled snap point values', async () => {
		const view = await render(InvalidSnapPointHost);
		const drawer = getDrawer(view);

		expect(String(drawer.activeSnapPoint())).toBe('300px');

		drawer.setActiveSnapPoint(999);
		view.detectChanges();

		expect(String(drawer.activeSnapPoint())).toBe('300px');
		expect(view.fixture.componentInstance.snapPointChanges).toHaveBeenLastCalledWith(999);
	});

	it('normalizes invalid nested swipe progress without notifying for duplicate values', async () => {
		const view = await render(NestedSwipeProgressHost);
		const parent = getDrawer(view, 'parent');
		const child = getDrawer(view, 'child');
		const handleProgressChange = vi.fn();
		parent.nestedSwipeProgressStore.subscribe(handleProgressChange);

		child.onNestedSwipeProgressChange(0.5);
		expect(parent.nestedSwipeProgressStore.getSnapshot()).toBe(0.5);
		expect(handleProgressChange).toHaveBeenCalledTimes(1);

		handleProgressChange.mockClear();

		child.onNestedSwipeProgressChange(0.5);
		expect(parent.nestedSwipeProgressStore.getSnapshot()).toBe(0.5);
		expect(handleProgressChange).not.toHaveBeenCalled();

		child.onNestedSwipeProgressChange(Number.NaN);
		expect(parent.nestedSwipeProgressStore.getSnapshot()).toBe(0);
		expect(handleProgressChange).toHaveBeenCalledTimes(1);
	});

	it.each([
		{ label: 'a controlled drawer', controlled: true },
		{ label: 'a drawer opened imperatively', controlled: false },
	])('reports and unregisters $label', async ({ controlled }) => {
		const view = await render(ProviderRegistrationHost, { inputs: { controlled } });
		if (!controlled) getDrawer(view).open();
		await settle(view);
		const provider = view.fixture.debugElement.query(By.directive(BrnDrawerProvider)).injector.get(BrnDrawerProvider);

		expect(provider.active()).toBe(true);
		expect(byTestId('background')).toHaveAttribute('data-active', '');

		await view.rerender({ inputs: { showDrawer: false }, partialUpdate: true });
		view.detectChanges();

		expect(provider.active()).toBe(false);
		expect(byTestId('background')).toHaveAttribute('data-inactive', '');
	});

	it('clears swipe-dismiss styles when swipe close is canceled', async () => {
		const { view, viewport, popup } = await renderSwipeHost({
			disableClose: true,
			viewportHeight: 300,
			popupHeight: 200,
		});
		const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;

		await simulateTimedDownSwipe(viewport, 100, 250, 1000, 1010, 1040);
		view.detectChanges();

		expect(popup).not.toHaveAttribute('data-swipe-dismiss');
		expect(backdrop).not.toHaveAttribute('data-swipe-dismiss');
		expect(popup).not.toHaveAttribute('data-ending-style');
		expect(backdrop).not.toHaveAttribute('data-swiping');
		expect(popup).toHaveAttribute('data-open', '');
		expect(popup.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('0px');
	});

	// spartan's `state` input isn't a fully controlled prop, so a parent keeps the drawer open by
	// rejecting the dismissal with `disableClose`.
	it('does not dismiss a controlled drawer via swipe when open is always true', async () => {
		const { view, viewport, popup } = await renderSwipeHost({
			disableClose: true,
			viewportHeight: 300,
			popupHeight: 200,
		});
		const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;

		await simulateTimedDownSwipe(viewport, 100, 250, 1000, 1010, 1040);
		await frame();
		view.detectChanges();

		expect(popup).not.toHaveAttribute('data-swipe-dismiss');
		expect(backdrop).not.toHaveAttribute('data-swipe-dismiss');
		expect(popup).not.toHaveAttribute('data-ending-style');
		expect(popup).toHaveAttribute('data-open', '');
	});

	it('does not restore snap point when a controlled swipe close is accepted by the parent', async () => {
		// Start at '300px' (non-default) so a reset to the default ('100px') is distinguishable from
		// restoring the pre-swipe value.
		const { view, host, viewport } = await renderSwipeHost({
			snapPoints: SNAP_POINTS,
			snapPoint: SNAP_POINTS[1],
			viewportHeight: 600,
			popupHeight: 600,
		});

		await simulateTimedDownSwipe(viewport, 100, 260, 1000, 1010, 1040);
		view.detectChanges();

		expect(String(host.snapPoint())).toBe('100px');
	});

	it('restores snap point and swipe offsets when swipe close is canceled', async () => {
		const { view, host, viewport, popup } = await renderSwipeHost({
			snapPoints: SNAP_POINTS,
			snapPoint: SNAP_POINTS[0],
			disableClose: true,
			viewportHeight: 600,
			popupHeight: 600,
		});

		await simulateTimedDownSwipe(viewport, 100, 260, 1000, 1010, 1040);
		view.detectChanges();

		expect(String(host.snapPoint())).toBe('100px');
		expect(popup).toHaveAttribute('data-open', '');
		expect(popup).not.toHaveAttribute('data-swipe-dismiss');
		expect(popup).not.toHaveAttribute('data-ending-style');
		expect(popup.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('0px');
	});

	it('damps active snap point overshoot after the swipe direction is established', async () => {
		const { viewport, popup } = await renderSwipeHost({
			defaultSnapPoint: 1,
			snapPoints: ['100px', 1],
			viewportHeight: 400,
			popupHeight: 400,
		});

		await simulateTimedSwipe(viewport, [
			{ type: 'down', x: 100, y: 200 },
			{ type: 'move', x: 100, y: 200 },
			{ type: 'move', x: 100, y: 100 },
			{ type: 'move', x: 100, y: 50 },
		]);

		expect(popup.style.transform).toBe('');
		expect(Number.parseFloat(popup.style.getPropertyValue('--drawer-swipe-movement-y'))).toBeCloseTo(-Math.sqrt(150));
	});

	describe('sequential snap points', () => {
		const sequentialInputs = {
			snapPoints: SNAP_POINTS,
			snapPoint: SNAP_POINTS[0],
			snapToSequentialPoints: true,
			viewportHeight: 600,
			popupHeight: 600,
		};

		it('allows dragging past a snap point when snapToSequentialPoints is enabled', async () => {
			const { host, viewport } = await renderSwipeHost(sequentialInputs);

			await simulateTimedDownSwipe(viewport, 500, 50, 1000, 1010, 1040);

			expect(String(host.snapPoint())).toBe('1');
		});

		it.each([false, true])('advances on a short flick with a trailing stationary sample: %s', async (phantom) => {
			const { host, viewport } = await renderSwipeHost(sequentialInputs);

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 500, time: 992 },
				{ type: 'move', x: 100, y: 500, time: 1000 },
				{ type: 'move', x: 100, y: 488, time: 1016 },
				{ type: 'move', x: 100, y: 476, time: 1032 },
				{ type: 'move', x: 100, y: 464, time: 1048 },
				...(phantom ? [{ type: 'move' as const, x: 100, y: 463.5, time: 1064 }] : []),
				{ type: 'up', x: 100, y: phantom ? 463.5 : 464, time: phantom ? 1072 : 1056 },
			]);

			expect(String(host.snapPoint())).toBe('300px');
		});

		it('stays on the current snap point after repeated stationary samples', async () => {
			const { host, viewport } = await renderSwipeHost(sequentialInputs);

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 500, time: 992 },
				{ type: 'move', x: 100, y: 500, time: 1000 },
				{ type: 'move', x: 100, y: 460, time: 1016 },
				{ type: 'move', x: 100, y: 460, time: 1032 },
				{ type: 'move', x: 100, y: 460, time: 1048 },
				{ type: 'move', x: 100, y: 460, time: 1064 },
				{ type: 'up', x: 100, y: 460, time: 1072 },
			]);

			expect(String(host.snapPoint())).toBe('100px');
		});

		it('advances to the next snap point on fast flicks when snapToSequentialPoints is enabled', async () => {
			const { host, viewport } = await renderSwipeHost(sequentialInputs);

			await simulateTimedDownSwipe(viewport, 500, 460, 2000, 2010, 2050);

			expect(String(host.snapPoint())).toBe('300px');
		});
	});

	it('keeps the drawer open on low-velocity swipes near a snap point', async () => {
		const { host, viewport } = await renderSwipeHost({
			snapPoints: SNAP_POINTS,
			snapPoint: SNAP_POINTS[0],
			viewportHeight: 600,
			popupHeight: 600,
		});

		await simulateTimedDownSwipe(viewport, 100, 120, 1000, 1005, 1035, 1015);

		expect(host.stateChanges).not.toHaveBeenCalledWith('closed');
		expect(String(host.snapPoint())).toBe('100px');
	});

	it('keeps the drawer open when the release velocity reverses during an upward swipe', async () => {
		const { host, viewport } = await renderSwipeHost({
			snapPoints: SNAP_POINTS,
			snapPoint: SNAP_POINTS[0],
			viewportHeight: 600,
			popupHeight: 600,
		});

		await simulateTimedSwipe(viewport, [
			{ type: 'down', x: 100, y: 300, time: 1000 },
			{ type: 'move', x: 100, y: 299, time: 1003 },
			{ type: 'move', x: 100, y: 120, time: 1010 },
			{ type: 'move', x: 100, y: 140, time: 1015 },
			{ type: 'up', x: 100, y: 140, time: 1025 },
		]);

		expect(host.stateChanges).not.toHaveBeenCalledWith('closed');
	});

	describe('snap point gestures', () => {
		const gestureInputs = (inputs: ComponentInput<SwipeHost>): ComponentInput<SwipeHost> => ({
			snapPoints: SNAP_POINTS,
			viewportHeight: 600,
			popupHeight: 600,
			...inputs,
		});

		it('chooses the nearest sequential snap point on a slow drag', async () => {
			const { host, viewport } = await renderSwipeHost(
				gestureInputs({ snapPoint: '100px', snapToSequentialPoints: true }),
			);

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 500, time: 1000 },
				{ type: 'move', x: 100, y: 499, time: 1010 },
				{ type: 'move', x: 100, y: 350, time: 2010 },
				{ type: 'up', x: 100, y: 350, time: 2011 },
			]);

			expect(String(host.snapPoint())).toBe('300px');
		});

		it('advances a sequential snap point toward dismissal', async () => {
			const { host, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: 1, snapToSequentialPoints: true }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 140, time: 1020 },
				{ type: 'up', x: 100, y: 140, time: 1021 },
			]);

			expect(String(host.snapPoint())).toBe('300px');
		});

		it('dismisses past the final sequential snap point', async () => {
			const { view, viewport } = await renderSwipeHost(
				gestureInputs({ snapPoint: '100px', snapToSequentialPoints: true }),
			);

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 160, time: 1020 },
				{ type: 'up', x: 100, y: 160, time: 1021 },
			]);

			await expectRemoved(view, 'popup');
		});

		it('dismisses when a slow snap-point drag ends closer to closed', async () => {
			const { view, viewport } = await renderSwipeHost(
				gestureInputs({ snapPoint: '100px', snapToSequentialPoints: true }),
			);

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 180, time: 2010 },
				{ type: 'up', x: 100, y: 180, time: 2011 },
			]);

			await expectRemoved(view, 'popup');
		});

		it('dismisses from upward snap points using upward velocity', async () => {
			const { view, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: '100px', swipeDirection: 'up' }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 500, time: 1000 },
				{ type: 'move', x: 100, y: 499, time: 1010 },
				{ type: 'move', x: 100, y: 420, time: 1020 },
				{ type: 'up', x: 100, y: 420, time: 1021 },
			]);

			await expectRemoved(view, 'popup');
		});

		it('opens from a controlled null snap point', async () => {
			const { host, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: null }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 99, time: 1010 },
				{ type: 'move', x: 100, y: 60, time: 1020 },
				{ type: 'up', x: 100, y: 60, time: 1021 },
			]);

			expect(String(host.snapPoint())).toBe('1');
		});

		it('dismisses from a controlled null snap point', async () => {
			const { view, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: null }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 160, time: 1020 },
				{ type: 'up', x: 100, y: 160, time: 1021 },
			]);

			await expectRemoved(view, 'popup');
		});

		it('keeps the first sequential snap point on a fast opening flick', async () => {
			const { host, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: 1, snapToSequentialPoints: true }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 99, time: 1010 },
				{ type: 'move', x: 100, y: 40, time: 1020 },
				{ type: 'up', x: 100, y: 40, time: 1021 },
			]);

			expect(String(host.snapPoint())).toBe('1');
		});

		it('keeps the current snap point after a sub-threshold drag', async () => {
			const { host, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: '300px' }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 105, time: 2010 },
				{ type: 'up', x: 100, y: 105, time: 2011 },
			]);

			expect(String(host.snapPoint())).toBe('300px');
		});

		it('dismisses a non-sequential snap point when closed is nearest', async () => {
			const { view, viewport } = await renderSwipeHost(gestureInputs({ snapPoint: '100px' }));

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 180, time: 2010 },
				{ type: 'up', x: 100, y: 180, time: 2011 },
			]);

			await expectRemoved(view, 'popup');
		});

		it('restores a snap point when a controlled parent rejects dismissal', async () => {
			// Start from a non-default snap point: only then does restoring it differ from the reset to
			// the default ('100px') that a close performs.
			const { view, host, viewport, popup } = await renderSwipeHost(
				gestureInputs({ snapPoint: '300px', disableClose: true }),
			);

			await simulateTimedSwipe(viewport, [
				{ type: 'down', x: 100, y: 100, time: 1000 },
				{ type: 'move', x: 100, y: 101, time: 1010 },
				{ type: 'move', x: 100, y: 160, time: 1020 },
				{ type: 'up', x: 100, y: 160, time: 1021 },
			]);
			await frame();
			view.detectChanges();

			expect(String(host.snapPoint())).toBe('300px');
			expect(popup).toHaveAttribute('data-open', '');
		});
	});

	it('closes an uncontrolled drawer after a slow long drag', async () => {
		const view = await render(UncontrolledHost);
		getDrawer(view).open();
		await settle(view);
		pointAt(byTestId('popup'));

		await simulateTimedSwipe(byTestId('viewport'), [
			{ type: 'down', x: 100, y: 100, time: 1000 },
			{ type: 'move', x: 100, y: 101, time: 1010 },
			{ type: 'move', x: 100, y: 250, time: 2010 },
			{ type: 'up', x: 100, y: 250, time: 2011 },
		]);

		await expectRemoved(view, 'popup');
	});

	describe('CloseWatcher', () => {
		class CloseWatcherStub extends EventTarget {
			public static instances: CloseWatcherStub[] = [];
			public active = true;

			constructor() {
				super();
				CloseWatcherStub.instances.push(this);
			}

			public destroy() {
				this.active = false;
			}

			// Mirrors the browser: `cancel` fires first and can only be prevented while the page has
			// history-action activation; otherwise the watcher is destroyed before `close` fires.
			public requestClose(cancelable: boolean) {
				if (!this.active) return;

				const cancelEvent = new Event('cancel', { cancelable });
				this.dispatchEvent(cancelEvent);
				if (cancelEvent.defaultPrevented) return;

				this.destroy();
				this.dispatchEvent(new Event('close'));
			}
		}

		/** The drawer only connects a CloseWatcher on Android. */
		function androidPlatform(): Platform {
			const platform = new Platform(inject(PLATFORM_ID));
			Object.defineProperty(platform, 'ANDROID', { value: true });
			return platform;
		}

		const win = window as Window & { CloseWatcher?: unknown };
		const originalCloseWatcher = win.CloseWatcher;

		beforeEach(() => {
			CloseWatcherStub.instances = [];
			win.CloseWatcher = CloseWatcherStub;
		});

		afterEach(() => {
			win.CloseWatcher = originalCloseWatcher;
		});

		async function renderOpenDrawer(inputs: { disableClose?: boolean } = {}) {
			const view = await render(CloseWatcherHost, {
				inputs,
				providers: [{ provide: Platform, useFactory: androidPlatform }],
			});
			getDrawer(view).open();
			await settle(view);
			view.fixture.componentInstance.stateChanges.mockClear();
			return view;
		}

		function currentWatcher() {
			return CloseWatcherStub.instances[CloseWatcherStub.instances.length - 1];
		}

		async function requestClose(view: RenderResult, cancelable = true) {
			currentWatcher().requestClose(cancelable);
			await settle(view);
		}

		async function expectClosed(view: RenderResult) {
			await waitFor(() => {
				view.detectChanges();
				expect(dialog()).toBeNull();
			});
		}

		it('closes when the watcher requests a close', async () => {
			const view = await renderOpenDrawer();

			await requestClose(view);

			expect(view.fixture.componentInstance.stateChanges).toHaveBeenCalledTimes(1);
			expect(view.fixture.componentInstance.stateChanges).toHaveBeenCalledWith('closed');
			await expectClosed(view);
			expect(currentWatcher().active).toBe(false);
		});

		it('keeps the same watcher active when a cancelable close request is canceled', async () => {
			const view = await renderOpenDrawer({ disableClose: true });
			const watcher = currentWatcher();
			const instanceCount = CloseWatcherStub.instances.length;

			await requestClose(view);

			expect(dialog()).not.toBeNull();
			expect(CloseWatcherStub.instances).toHaveLength(instanceCount);
			expect(watcher.active).toBe(true);

			await view.rerender({ inputs: { disableClose: false }, partialUpdate: true });
			view.detectChanges();
			await requestClose(view);

			await expectClosed(view);
			expect(watcher.active).toBe(false);
		});

		it('closes on a close request that cannot be prevented even if the close is rejected', async () => {
			const view = await renderOpenDrawer({ disableClose: true });

			await requestClose(view, false);

			expect(view.fixture.componentInstance.stateChanges).toHaveBeenCalledTimes(1);
			expect(view.fixture.componentInstance.stateChanges).toHaveBeenCalledWith('closed');
			await expectClosed(view);
			expect(currentWatcher().active).toBe(false);
		});

		it('destroys the watcher on unmount', async () => {
			const view = await renderOpenDrawer({ disableClose: true });
			const watcher = currentWatcher();

			await requestClose(view);
			expect(watcher.active).toBe(true);

			view.fixture.destroy();
			expect(watcher.active).toBe(false);
		});
	});
});

describe('BrnDrawer snap point composition', () => {
	@Component({
		selector: 'brn-drawer-snap-points-host',
		imports: [BrnDrawerImports],
		changeDetection: ChangeDetectionStrategy.OnPush,
		template: `
			<div brnDrawer [state]="'open'" [modal]="false" [snapPoints]="snapPoints()" [snapPoint]="snapPoint()">
				<div *brnDrawerPortal brnDrawerViewport [style.height.px]="viewportHeight()">
					<div brnDrawerPopup data-testid="popup" [style.height.px]="popupHeight()">Drawer</div>
				</div>
			</div>
		`,
	})
	class SnapPointsHost {
		public readonly snapPoints = input.required<BrnDrawerSnapPoint[]>();
		public readonly snapPoint = input<BrnDrawerSnapPoint | null | undefined>(undefined);
		public readonly popupHeight = input(300);
		public readonly viewportHeight = input(400);
	}

	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	async function renderSnapPoints(inputs: { snapPoints: BrnDrawerSnapPoint[]; snapPoint?: BrnDrawerSnapPoint | null }) {
		const view = await render(SnapPointsHost, { inputs });
		await settle(view);
		return { view, drawer: getDrawer(view) };
	}

	it('resolves supported units, filters invalid values, clamps heights, and keeps the last duplicate', async () => {
		const previousFontSize = document.documentElement.style.fontSize;
		document.documentElement.style.fontSize = '20px';

		try {
			const { view, drawer } = await renderSnapPoints({
				snapPoints: [Number.NaN, 'invalid', 'invalidpx', 'invalidrem', -1, '2rem', '100px', 200, 200.5, 800],
				snapPoint: 200,
			});

			await waitFor(() => {
				expect(drawer.resolvedSnapPoints()).toEqual([
					{ value: -1, height: 0, offset: 300 },
					{ value: '2rem', height: 40, offset: 260 },
					{ value: '100px', height: 100, offset: 200 },
					{ value: 200.5, height: 200.5, offset: 99.5 },
					{ value: 800, height: 300, offset: 0 },
				]);
			});
			expect(drawer.activeSnapPointOffset()).toBe(99.5);
			view.detectChanges();
			expect(byTestId('popup').style.getPropertyValue('--drawer-snap-point-offset')).toBe('99.5px');
		} finally {
			document.documentElement.style.fontSize = previousFontSize;
		}
	});

	it('uses fractional and pixel snap points and resolves null or invalid active values as closed', async () => {
		const snapPoints = [0.5, 200, '2rem'];
		const { view, drawer } = await renderSnapPoints({ snapPoints, snapPoint: 200 });

		await waitFor(() => expect(drawer.activeSnapPointOffset()).toBe(100));

		await view.rerender({ inputs: { snapPoints, snapPoint: null }, partialUpdate: true });
		view.detectChanges();
		expect(drawer.activeSnapPointOffset()).toBeNull();
		expect(byTestId('popup').style.getPropertyValue('--drawer-snap-point-offset')).toBe('0px');

		await view.rerender({ inputs: { snapPoints, snapPoint: 'invalid' }, partialUpdate: true });
		view.detectChanges();
		expect(drawer.activeSnapPointOffset()).toBeNull();
	});

	it('produces no resolved snap point when the list is empty', async () => {
		const { drawer } = await renderSnapPoints({ snapPoints: [] });

		expect(drawer.resolvedSnapPoints()).toEqual([]);
		expect(drawer.activeSnapPointOffset()).toBeNull();
	});

	it('resolves a single snap point without a deduplication pass', async () => {
		const { drawer } = await renderSnapPoints({ snapPoints: ['100px'], snapPoint: '100px' });

		await waitFor(() => expect(drawer.resolvedSnapPoints()).toEqual([{ value: '100px', height: 100, offset: 200 }]));
		expect(drawer.activeSnapPointOffset()).toBe(200);
	});
});
