import type { Provider } from '@angular/core';
import { By } from '@angular/platform-browser';
import { render, type RenderResult } from '@testing-library/angular';
import { vi } from 'vitest';
import { BrnDrawerImports } from '../../index';
import { BrnDrawer } from '../brn-drawer';

export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Point {
	clientX: number;
	clientY: number;
}

export type TouchType = 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel';

export function createTouch(target: EventTarget, point: Point, identifier = 1): Touch {
	return new Touch({ identifier, target, ...point });
}

/**
 * Creates a touch event at the given points. `touchend`/`touchcancel` report them as
 * `changedTouches` only, like a lifted finger.
 */
export function createTouchEvent(
	target: Element,
	type: TouchType,
	points: Point | Point[],
	{ cancelable = true }: { cancelable?: boolean } = {},
): TouchEvent {
	const touches = (Array.isArray(points) ? points : [points]).map((point, index) =>
		createTouch(target, point, index + 1),
	);
	const ended = type === 'touchend' || type === 'touchcancel';
	return new TouchEvent(type, {
		bubbles: true,
		cancelable,
		composed: true,
		touches: ended ? [] : touches,
		targetTouches: ended ? [] : touches,
		changedTouches: touches,
	});
}

/** Dispatches a touch event. Like `fireEvent`, returns `false` when a listener prevented it. */
export function fireTouch(
	target: Element,
	type: TouchType,
	points: Point | Point[],
	options?: { cancelable?: boolean },
): boolean {
	return target.dispatchEvent(createTouchEvent(target, type, points, options));
}

export interface PointerInit {
	clientX?: number;
	clientY?: number;
	button?: number;
	buttons?: number;
	pointerId?: number;
	pointerType?: string;
	/** Overrides the event time, so velocities don't depend on how fast the test runs. */
	timeStamp?: number;
}

/** Dispatches a pointer event. Like `fireEvent`, returns `false` when a listener prevented it. */
export function firePointer(target: Element, type: string, init: PointerInit = {}): boolean {
	const { timeStamp, ...eventInit } = init;
	const event = new PointerEvent(type, {
		bubbles: true,
		cancelable: true,
		composed: true,
		isPrimary: true,
		pointerId: 1,
		pointerType: 'mouse',
		...eventInit,
	});
	if (timeStamp !== undefined) Object.defineProperty(event, 'timeStamp', { value: timeStamp });
	return target.dispatchEvent(event);
}

/** Stubs the document hit test the swipe uses to find the element under the finger or cursor. */
export function mockHitTest(result: Element | null | ((x: number, y: number) => Element | null)) {
	return vi
		.spyOn(document, 'elementFromPoint')
		.mockImplementation(typeof result === 'function' ? result : () => result);
}

type LayoutMetric = 'offsetHeight' | 'offsetWidth' | 'scrollHeight' | 'clientHeight' | 'scrollWidth' | 'clientWidth';

/** Overrides layout metrics on an element, like Base UI's tests do for jsdom. */
export function stubLayout(element: Element, metrics: Partial<Record<LayoutMetric, number>>): void {
	for (const [name, value] of Object.entries(metrics)) {
		Object.defineProperty(element, name, { configurable: true, value });
	}
}

export const byTestId = <T extends HTMLElement = HTMLElement>(id: string) =>
	document.querySelector(`[data-testid="${id}"]`) as T;

/** The CDK backdrop of the (single) modal drawer: spartan's `Drawer.Backdrop`. */
export const backdrop = () => document.querySelector('.cdk-overlay-backdrop') as HTMLElement;

export interface DrawerTemplateAttributes {
	drawer?: string;
	viewport?: string;
	popup?: string;
}

/**
 * The usual drawer markup (root, portal, viewport `viewport` and popup `popup`), with extra
 * attributes for each part.
 */
export function drawerTemplate(content = 'Drawer', attributes: DrawerTemplateAttributes = {}): string {
	return `
		<div brnDrawer ${attributes.drawer ?? ''}>
			<div *brnDrawerPortal brnDrawerViewport data-testid="viewport" ${attributes.viewport ?? ''}>
				<div brnDrawerPopup data-testid="popup" ${attributes.popup ?? ''}>${content}</div>
			</div>
		</div>
	`;
}

export function getDrawers(view: RenderResult<unknown>): BrnDrawer[] {
	return view.fixture.debugElement.queryAll(By.directive(BrnDrawer)).map((element) => element.injector.get(BrnDrawer));
}

export function getDrawer(view: RenderResult<unknown>, testId?: string): BrnDrawer {
	const element = testId
		? view.fixture.debugElement.query(By.css(`[data-testid="${testId}"]`))
		: view.fixture.debugElement.query(By.directive(BrnDrawer));
	return element.injector.get(BrnDrawer);
}

export async function settle(view: RenderResult<unknown>, ms = 20): Promise<void> {
	view.detectChanges();
	await wait(ms);
	view.detectChanges();
}

export interface RenderDrawerOptions {
	props?: Record<string, unknown>;
	providers?: Provider[];
	/** Opens every drawer in the template, nested ones included. */
	open?: boolean;
}

/**
 * Renders a drawer template and opens it. `stateChanged` and `snapPointChange` record the changes
 * of the outermost drawer made after it opened: the equivalents of `onOpenChange` and
 * `onSnapPointChange`.
 */
export async function renderDrawer(
	template: string,
	{ props = {}, providers = [], open = true }: RenderDrawerOptions = {},
) {
	const view = await render<Record<string, unknown>>(template, {
		imports: [...BrnDrawerImports],
		componentProperties: props,
		providers,
	});
	const drawer = getDrawer(view);

	if (open) {
		// Nested drawers only exist once their parent renders its popup.
		for (let depth = 0; depth < 3; depth++) {
			getDrawers(view)
				.filter((instance) => !instance.isOpen())
				.forEach((instance) => instance.open());
			await settle(view);
		}
	}

	const stateChanged = vi.fn();
	const snapPointChange = vi.fn();
	drawer.stateChanged.subscribe(stateChanged);
	drawer.snapPoint.subscribe(snapPointChange);

	return { view, drawer, stateChanged, snapPointChange };
}

export function cleanupOverlays(): void {
	vi.restoreAllMocks();
	document.getSelection()?.removeAllRanges();
	document.querySelectorAll('.cdk-overlay-container').forEach((element) => element.remove());
}
