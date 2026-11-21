import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrnDrawerProvider } from './brn-drawer-provider';
import {
	backdrop,
	byTestId,
	cleanupOverlays,
	createTouchEvent,
	drawerTemplate,
	firePointer,
	fireTouch,
	getDrawer,
	mockHitTest,
	renderDrawer,
	settle,
	stubLayout,
} from './testing/drawer-test-utils';

/** A primary-button mouse press, as Base UI's tests fire it. */
const press = { button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse' } as const;
/** A mouse move with the primary button held. */
const drag = { buttons: 1, pointerId: 1, pointerType: 'mouse' } as const;
/** A mouse release. */
const release = { pointerId: 1, pointerType: 'mouse' } as const;

function selectText(node: Node, start: number, end: number): Selection {
	const selection = window.getSelection() as Selection;
	const range = document.createRange();
	range.setStart(node, start);
	range.setEnd(node, end);
	selection.removeAllRanges();
	selection.addRange(range);
	return selection;
}

const NESTED_TEMPLATE = (childAttributes = '', childContent = 'Child') => `
	<div brnDrawer data-testid="parent">
		<div *brnDrawerPortal brnDrawerViewport data-testid="parent-viewport">
			<div brnDrawerPopup data-testid="parent-popup">
				<div brnDrawer data-testid="child" ${childAttributes}>
					<div *brnDrawerPortal brnDrawerViewport data-testid="child-viewport" style="height: 400px">
						<div brnDrawerPopup data-testid="child-popup" style="height: 300px">${childContent}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
`;

describe('BrnDrawerViewport', () => {
	afterEach(() => cleanupOverlays());

	it.each([
		[true, 'true', true],
		['trap-focus', 'true', true],
		[false, 'false', false],
	] as const)(
		'with modal %s, sets aria-modal %s and hides the page from assistive technology: %s',
		async (modal, ariaModal, pageHidden) => {
			const page = document.body.appendChild(document.createElement('main'));
			const { view } = await renderDrawer(drawerTemplate('<button>Inside</button>', { drawer: '[modal]="modal"' }), {
				props: { modal },
			});
			await settle(view);

			expect(document.querySelector('cdk-dialog-container')?.getAttribute('aria-modal')).toBe(ariaModal);
			expect(page.getAttribute('aria-hidden') === 'true').toBe(pageHidden);
			page.remove();
		},
	);

	it('registers the non-passive document touchmove listener only while open', async () => {
		const activeListeners = new Set<EventListenerOrEventListenerObject>();
		const addEventListener = document.addEventListener.bind(document);
		vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
			if (type === 'touchmove' && typeof options === 'object' && options.passive === false) {
				activeListeners.add(listener);
				// The viewport removes it by aborting the signal it was added with.
				options.signal?.addEventListener('abort', () => activeListeners.delete(listener));
			}
			addEventListener(type, listener, options);
		});

		const { view, drawer } = await renderDrawer(drawerTemplate(), { open: false });
		expect(activeListeners.size).toBe(0);

		drawer.open();
		await settle(view);
		expect(activeListeners.size).toBe(1);

		drawer.close();
		await settle(view, 100);
		expect(activeListeners.size).toBe(0);
	});

	it('clears text selection on swipe start', async () => {
		await renderDrawer(drawerTemplate('<div brnDrawerContent><span data-testid="text">Selectable</span></div>'));
		const text = byTestId('text');
		const selection = selectText(text.firstChild as Node, 0, 5);
		expect(selection.isCollapsed).toBe(false);

		mockHitTest(byTestId('popup'));
		firePointer(byTestId('viewport'), 'pointerdown', { ...press, clientX: 0, clientY: 0 });

		expect(selection.rangeCount).toBe(0);
	});

	it('preserves text selection outside the popup when a swipe starts', async () => {
		await renderDrawer(`<span data-testid="outside-text">Outside selection</span>${drawerTemplate()}`);
		const selection = selectText(byTestId('outside-text').firstChild as Node, 0, 7);

		mockHitTest(byTestId('popup'));
		firePointer(byTestId('viewport'), 'pointerdown', { ...press, clientX: 0, clientY: 0 });

		expect(selection.rangeCount).toBe(1);
		expect(selection.toString()).toBe('Outside');
	});

	it('does not clear text selection on touch swipe start', async () => {
		await renderDrawer(drawerTemplate('<div brnDrawerContent><span data-testid="text">Selectable</span></div>'));
		const selection = selectText(byTestId('text').firstChild as Node, 0, 5);
		expect(selection.isCollapsed).toBe(false);

		mockHitTest(byTestId('popup'));
		const viewport = byTestId('viewport');
		fireTouch(viewport, 'touchstart', { clientX: 0, clientY: 0 });

		expect(selection.rangeCount).toBe(1);
	});

	it('starts touch swipes from interactive elements', async () => {
		const { view } = await renderDrawer(drawerTemplate('<button type="button" data-testid="button">Action</button>'));
		const button = byTestId('button');

		mockHitTest(button);
		fireTouch(button, 'touchstart', { clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(backdrop()).toHaveAttribute('data-swiping', '');
	});

	describe('inside a shadow root', () => {
		let host: HTMLElement;
		let shadowRoot: ShadowRoot;

		/** Renders the CDK overlays, and with them the drawer, into `shadowRoot`. */
		@Injectable()
		class ShadowRootOverlayContainer extends OverlayContainer {
			protected override _createContainer(): void {
				super._createContainer();
				shadowRoot.appendChild(this._containerElement as HTMLElement);
			}
		}

		const query = (id: string) => shadowRoot.querySelector<HTMLElement>(`[data-testid="${id}"]`) as HTMLElement;
		const shadowBackdrop = () => shadowRoot.querySelector('.cdk-overlay-backdrop') as HTMLElement;

		beforeEach(() => {
			host = document.body.appendChild(document.createElement('div'));
			shadowRoot = host.attachShadow({ mode: 'open' });
		});

		afterEach(() => host.remove());

		it('uses shadow-root hit testing for touch swipe targets', async () => {
			const { view } = await renderDrawer(
				drawerTemplate(`
					<div data-testid="target">Target</div>
					<div data-swipe-ignore data-testid="ignored">Ignore</div>
				`),
				{ providers: [{ provide: OverlayContainer, useClass: ShadowRootOverlayContainer }] },
			);
			const target = query('target');
			const ignored = query('ignored');
			expect(target).not.toBeNull();
			expect(shadowBackdrop()).not.toBeNull();

			// Returning an in-popup element from the document hit test would start the swipe if the
			// shadow root were not consulted, so this pins the shadow-root lookup rather than the
			// `contains()` rejection that a retargeted host would also trigger.
			mockHitTest(target);
			const shadowHitTest = vi.spyOn(shadowRoot, 'elementFromPoint').mockImplementation(() => ignored);

			fireTouch(ignored, 'touchstart', { clientX: 0, clientY: 0 });
			await settle(view, 0);
			expect(shadowBackdrop()).not.toHaveAttribute('data-swiping');

			fireTouch(ignored, 'touchend', { clientX: 0, clientY: 0 });
			shadowHitTest.mockImplementation(() => target);

			fireTouch(target, 'touchstart', { clientX: 0, clientY: 0 });
			await settle(view, 0);
			expect(shadowBackdrop()).toHaveAttribute('data-swiping', '');
		});

		it('starts a swipe inside a shadow root using real hit testing', async () => {
			const { view } = await renderDrawer(
				drawerTemplate('Content', {
					drawer: 'swipeDirection="down"',
					popup: 'style="position: fixed; top: 0; left: 0; width: 200px; height: 200px"',
				}),
				{ providers: [{ provide: OverlayContainer, useClass: ShadowRootOverlayContainer }] },
			);
			const popup = query('popup');
			expect(popup).not.toBeNull();

			// No `elementFromPoint` stubbing: a real document hit test retargets the popup content to
			// the shadow host, which fails the `contains()` check in the swipe `canStart` guard, so
			// this only engages when the hit test runs against the shadow root.
			fireTouch(popup, 'touchstart', { clientX: 100, clientY: 100 });
			fireTouch(popup, 'touchmove', { clientX: 100, clientY: 125 });
			await settle(view, 0);

			expect(shadowBackdrop()).toHaveAttribute('data-swiping', '');
			fireTouch(popup, 'touchend', { clientX: 100, clientY: 125 });
		});
	});

	it('clears the backdrop data-swiping attribute when the drawer unmounts mid-swipe', async () => {
		const { view } = await renderDrawer(drawerTemplate('<button type="button" data-testid="button">Action</button>'));
		const button = byTestId('button');
		const backdropElement = backdrop();

		mockHitTest(button);
		fireTouch(button, 'touchstart', { clientX: 0, clientY: 0 });
		await settle(view, 0);
		expect(backdropElement).toHaveAttribute('data-swiping', '');

		view.fixture.destroy();

		// The detached node keeps its attributes, so this asserts the cleanup removed
		// `data-swiping` from the backdrop that was mounted while swiping.
		expect(backdropElement).not.toHaveAttribute('data-swiping');
	});

	it('does not start non-touch swipes from brnDrawerContent', async () => {
		const { view } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent><div data-testid="target">Action</div></div>'),
		);
		const target = byTestId('target');

		mockHitTest(target);
		firePointer(target, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('does not jump when touch starts outside the popup and then enters it', async () => {
		const { view } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent>Content</div>', { drawer: 'swipeDirection="down"' }),
		);
		const viewport = byTestId('viewport');
		const popup = byTestId('popup');
		stubLayout(popup, { offsetHeight: 200 });

		mockHitTest((_x, y) => (y < 100 ? viewport : popup));
		fireTouch(viewport, 'touchstart', { clientX: 0, clientY: 0 });
		fireTouch(viewport, 'touchmove', { clientX: 0, clientY: 120 });
		await settle(view, 0);

		expect(backdrop()).toHaveAttribute('data-swiping', '');
		expect(Number.parseFloat(popup.style.getPropertyValue('--drawer-swipe-movement-y'))).toBe(0);
	});

	it('dismisses when touch starts outside the popup, then continues swiping down inside it', async () => {
		const { view, stateChanged } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent>Content</div>', { drawer: 'swipeDirection="down"' }),
		);
		const viewport = byTestId('viewport');
		const popup = byTestId('popup');
		stubLayout(popup, { offsetHeight: 200 });

		mockHitTest((_x, y) => (y < 100 ? viewport : popup));
		fireTouch(viewport, 'touchstart', { clientX: 0, clientY: 0 });
		fireTouch(viewport, 'touchmove', { clientX: 0, clientY: 120 });
		fireTouch(viewport, 'touchmove', { clientX: 0, clientY: 170 });
		fireTouch(viewport, 'touchend', { clientX: 0, clientY: 170 });
		await settle(view, 0);

		expect(stateChanged).toHaveBeenCalledWith('closed');
	});

	it('treats pen interactions on brnDrawerContent as non-touch swipes', async () => {
		const { view } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent><button type="button" data-testid="button">Action</button></div>', {
				drawer: 'swipeDirection="down"',
			}),
		);
		const button = byTestId('button');

		mockHitTest(button);
		firePointer(button, 'pointerdown', { ...press, pointerType: 'pen', clientX: 0, clientY: 0 });
		fireTouch(button, 'touchstart', { clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
		expect(fireTouch(button, 'touchmove', { clientX: 0, clientY: 10 })).toBe(true);
	});

	it('does not mark nested drawers as swiping until movement passes the threshold', async () => {
		const { view } = await renderDrawer(
			NESTED_TEMPLATE('swipeDirection="down"', '<button type="button" data-testid="child-button">Action</button>'),
		);
		const parentPopup = byTestId('parent-popup');
		const childPopup = byTestId('child-popup');
		const button = byTestId('child-button');
		stubLayout(childPopup, { offsetHeight: 200 });

		mockHitTest(childPopup);
		fireTouch(button, 'touchstart', { clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(byTestId('parent-viewport')).not.toHaveAttribute('data-nested-dialog-open');
		expect(byTestId('child-viewport')).not.toHaveAttribute('data-nested-dialog-open');
		expect(parentPopup).not.toHaveAttribute('data-nested-drawer-swiping');

		fireTouch(button, 'touchmove', { clientX: 0, clientY: 5 });
		fireTouch(button, 'touchmove', { clientX: 0, clientY: 20 });
		await settle(view, 0);

		expect(parentPopup).toHaveAttribute('data-nested-drawer-swiping', '');
	});

	it('clears nested swiping when a nested drawer swipe is reversed before release', async () => {
		const { view } = await renderDrawer(
			NESTED_TEMPLATE('swipeDirection="down"', '<button type="button" data-testid="child-button">Action</button>'),
		);
		const parentPopup = byTestId('parent-popup');
		const childPopup = byTestId('child-popup');
		const button = byTestId('child-button');
		stubLayout(childPopup, { offsetHeight: 200 });

		mockHitTest(childPopup);
		fireTouch(button, 'touchstart', { clientX: 0, clientY: 0 });
		await settle(view, 0);
		fireTouch(button, 'touchmove', { clientX: 0, clientY: 5 });
		fireTouch(button, 'touchmove', { clientX: 0, clientY: 20 });
		await settle(view, 0);
		expect(parentPopup).toHaveAttribute('data-nested-drawer-swiping', '');

		fireTouch(button, 'touchmove', { clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(parentPopup).not.toHaveAttribute('data-nested-drawer-swiping');
		expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
	});

	it('keeps damped snap-point styles when a duplicate-coordinate pointermove arrives', async () => {
		const { view } = await renderDrawer(drawerTemplate('Drawer', { drawer: `[snapPoints]="['100px', 1]"` }));
		const viewport = byTestId('viewport');
		const popup = byTestId('popup');

		mockHitTest(popup);
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 100 });
		await settle(view, 0);

		// The first move only re-anchors the drag origin.
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 100 });
		// Drag upward past the fully-open edge; the snap-point progress handler replaces the raw
		// frozen transform with square-root-damped movement on every processed move.
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(popup.style.transform).toBe('');
		const dampedMovementY = popup.style.getPropertyValue('--drawer-swipe-movement-y');
		expect(dampedMovementY).toBe('-10px');

		// A cursor pinned at a screen edge during an off-screen drag produces duplicate-coordinate
		// moves. They must not reinstate the raw frozen transform, which would jump the popup to the
		// undamped position.
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(popup.style.transform).toBe('');
		expect(popup.style.getPropertyValue('--drawer-swipe-movement-y')).toBe(dampedMovementY);

		// Only vertical directions are enabled, so horizontal jitter while the vertical position is
		// pinned leaves the drag offset unchanged. Such moves must not reinstate the raw frozen
		// transform either.
		firePointer(viewport, 'pointermove', { ...drag, clientX: 5, clientY: 0 });
		await settle(view, 0);

		expect(popup.style.transform).toBe('');
		expect(popup.style.getPropertyValue('--drawer-swipe-movement-y')).toBe(dampedMovementY);
	});

	it('toggles data-swiping on the backdrop while swiping', async () => {
		const { view } = await renderDrawer(drawerTemplate());
		const viewport = byTestId('viewport');

		mockHitTest(byTestId('popup'));
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		await settle(view, 0);
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 8 });
		await settle(view, 0);
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		firePointer(viewport, 'pointerup', { ...release, clientX: 0, clientY: 8 });
		await settle(view, 0);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('cancels pointer drags and ignores compatibility touch pointer cancellation', async () => {
		await renderDrawer(drawerTemplate());
		const viewport = byTestId('viewport');

		mockHitTest(byTestId('popup'));
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 20 });
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		firePointer(viewport, 'pointercancel', { ...release, clientX: 0, clientY: 20 });
		expect(backdrop()).not.toHaveAttribute('data-swiping');

		firePointer(viewport, 'pointerdown', { pointerId: 2, pointerType: 'touch' });
		firePointer(viewport, 'pointercancel', { pointerId: 2, pointerType: 'touch' });
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('ignores touchstart when there is no active touch', async () => {
		await renderDrawer(drawerTemplate());

		fireTouch(byTestId('viewport'), 'touchstart', []);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	describe('snap points', () => {
		/** A 300px popup in a 400px viewport, like Base UI's `setHeight` stubs. */
		const snapDrawer = (drawerAttributes: string, content = 'Drawer') =>
			drawerTemplate(content, {
				drawer: drawerAttributes,
				viewport: 'style="height: 400px"',
				popup: 'style="height: 300px"',
			});

		it('uses regular horizontal dismissal when snap points are configured', async () => {
			const { view, stateChanged } = await renderDrawer(
				drawerTemplate('Drawer', { drawer: `[snapPoints]="['100px', '200px']" swipeDirection="left"` }),
			);
			const viewport = byTestId('viewport');
			const popup = byTestId('popup');
			stubLayout(popup, { offsetWidth: 200 });

			mockHitTest(popup);
			firePointer(viewport, 'pointerdown', { ...press, clientX: 180, clientY: 10 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 179, clientY: 10 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 40, clientY: 10 });
			firePointer(viewport, 'pointerup', { ...release, clientX: 40, clientY: 10 });
			await settle(view, 0);

			expect(stateChanged).toHaveBeenCalledWith('closed');
		});

		it('does not dismiss from a fast swipe that was never attributed to the snap point axis', async () => {
			// The taller point is declared first so the expected settle target is not simply the first
			// resolved snap point.
			const { view, stateChanged, snapPointChange } = await renderDrawer(
				snapDrawer(`[snapPoints]="['200px', '100px']" swipeDirection="down"`),
			);
			const viewport = byTestId('viewport');
			const popup = byTestId('popup');

			mockHitTest(popup);
			// A mostly horizontal flick: cumulative |deltaX| stays above |deltaY| on every move so no
			// swipe direction is ever attributed, while the final samples carry fast downward velocity
			// from the finger arcing down at lift.
			firePointer(viewport, 'pointerdown', { ...press, clientX: 100, clientY: 10, timeStamp: 1000 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 120, clientY: 12, timeStamp: 1050 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 200, clientY: 20, timeStamp: 1100 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 240, clientY: 55, timeStamp: 1120 });
			firePointer(viewport, 'pointerup', { ...release, clientX: 240, clientY: 55, timeStamp: 1130 });
			await settle(view, 0);

			expect(stateChanged).not.toHaveBeenCalled();
			// The release settles on the nearest snap point rather than dismissing.
			expect(snapPointChange).not.toHaveBeenCalledWith(null);
			expect(snapPointChange).toHaveBeenCalledWith('100px');
			expect(popup).not.toHaveAttribute('data-ending-style');
			expect(popup).not.toHaveAttribute('data-swipe-dismiss');
		});

		it('navigates snap points from a drag that was never attributed to the swipe axis', async () => {
			const { view, stateChanged, snapPointChange } = await renderDrawer(
				snapDrawer(`[snapPoints]="['100px', '200px']" swipeDirection="down"`),
			);
			const viewport = byTestId('viewport');
			const popup = byTestId('popup');

			mockHitTest(popup);
			// A sustained diagonal drag: cumulative |deltaX| stays above |deltaY| on every move so no
			// direction is attributed, while the vertical component drags the sheet 150px upward toward
			// the taller snap point.
			firePointer(viewport, 'pointerdown', { ...press, clientX: 300, clientY: 300 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 280, clientY: 290 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 200, clientY: 220 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 140, clientY: 150 });
			firePointer(viewport, 'pointerup', { ...release, clientX: 140, clientY: 150 });
			await settle(view, 0);

			expect(snapPointChange).toHaveBeenCalledWith('200px');
			expect(stateChanged).not.toHaveBeenCalled();
			expect(popup).not.toHaveAttribute('data-ending-style');
		});

		it('clears nested swipe state after an unattributed snap point gesture', async () => {
			const { view } = await renderDrawer(NESTED_TEMPLATE(`[snapPoints]="['100px', '200px']" swipeDirection="down"`));
			const parentPopup = byTestId('parent-popup');
			const childViewport = byTestId('child-viewport');

			mockHitTest(byTestId('child-popup'));
			firePointer(childViewport, 'pointerdown', { ...press, clientX: 100, clientY: 10 });
			firePointer(childViewport, 'pointermove', { ...drag, clientX: 120, clientY: 12 });
			firePointer(childViewport, 'pointermove', { ...drag, clientX: 200, clientY: 30 });
			await settle(view, 0);

			expect(parentPopup).toHaveAttribute('data-nested-drawer-swiping', '');
			expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).not.toBe('0');

			firePointer(childViewport, 'pointerup', { ...release, clientX: 200, clientY: 30 });
			await settle(view, 0);

			expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
			expect(parentPopup).not.toHaveAttribute('data-nested-drawer-swiping');
		});

		it('clears nested swipe state after an attributed drag settles on a snap point', async () => {
			const { view } = await renderDrawer(NESTED_TEMPLATE(`[snapPoints]="['100px', '200px']" swipeDirection="down"`));
			const parentPopup = byTestId('parent-popup');
			const childPopup = byTestId('child-popup');
			const childViewport = byTestId('child-viewport');

			mockHitTest(childPopup);
			// A straight-down drag, so the swipe direction is attributed, ending in a slight upward
			// reversal: the reversal flips the sampled release velocity against the drag so the release
			// resolves through the slow fallback velocity and settles back on the snap point.
			firePointer(childViewport, 'pointerdown', { ...press, clientX: 100, clientY: 10, timeStamp: 1000 });
			firePointer(childViewport, 'pointermove', { ...drag, clientX: 100, clientY: 24, timeStamp: 1050 });
			firePointer(childViewport, 'pointermove', { ...drag, clientX: 100, clientY: 48, timeStamp: 1150 });
			await settle(view, 0);

			expect(parentPopup).toHaveAttribute('data-nested-drawer-swiping', '');
			expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).not.toBe('0');

			firePointer(childViewport, 'pointermove', { ...drag, clientX: 100, clientY: 44, timeStamp: 1250 });
			firePointer(childViewport, 'pointerup', { ...release, clientX: 100, clientY: 44, timeStamp: 1600 });
			await settle(view, 0);

			expect(childPopup).not.toHaveAttribute('data-ending-style');
			expect(childPopup).not.toHaveAttribute('data-swipe-dismiss');
			expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
			expect(parentPopup).not.toHaveAttribute('data-nested-drawer-swiping');
		});

		it('does not dismiss from an unattributed fast swipe with snapToSequentialPoints', async () => {
			const { view, stateChanged, snapPointChange } = await renderDrawer(
				snapDrawer(`[snapPoints]="['100px', '200px']" snapToSequentialPoints swipeDirection="down"`),
			);
			const viewport = byTestId('viewport');
			const popup = byTestId('popup');

			mockHitTest(popup);
			// Same mostly horizontal flick as the non-sequential test, released from the most-collapsed
			// snap point so the sequential branch has no adjacent point to advance to and decides to close.
			firePointer(viewport, 'pointerdown', { ...press, clientX: 100, clientY: 10, timeStamp: 1000 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 120, clientY: 12, timeStamp: 1050 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 200, clientY: 20, timeStamp: 1100 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 240, clientY: 55, timeStamp: 1120 });
			firePointer(viewport, 'pointerup', { ...release, clientX: 240, clientY: 55, timeStamp: 1130 });
			await settle(view, 0);

			expect(stateChanged).not.toHaveBeenCalled();
			expect(snapPointChange).not.toHaveBeenCalledWith(null);
			expect(snapPointChange).toHaveBeenCalledWith('100px');
			expect(popup).not.toHaveAttribute('data-ending-style');
			expect(popup).not.toHaveAttribute('data-swipe-dismiss');
		});

		it.each([
			{ suffix: '', sequential: '' },
			{ suffix: ' with snapToSequentialPoints', sequential: 'snapToSequentialPoints' },
		])(
			'settles on the nearest snap point when an unattributed drag ends past the last snap point$suffix',
			async ({ sequential }) => {
				const { view, stateChanged, snapPointChange } = await renderDrawer(
					snapDrawer(`[snapPoints]="['200px', '100px']" defaultSnapPoint="100px" ${sequential} swipeDirection="down"`),
				);
				const viewport = byTestId('viewport');
				const popup = byTestId('popup');

				mockHitTest(popup);
				// A slow diagonal drag that never attributes a direction and ends nearer the closed position
				// than to any snap point, so the release resolves through the close branch.
				firePointer(viewport, 'pointerdown', { ...press, clientX: 100, clientY: 100, timeStamp: 1000 });
				firePointer(viewport, 'pointermove', { ...drag, clientX: 200, clientY: 120, timeStamp: 1100 });
				firePointer(viewport, 'pointermove', { ...drag, clientX: 300, clientY: 170, timeStamp: 1400 });
				firePointer(viewport, 'pointermove', { ...drag, clientX: 400, clientY: 190, timeStamp: 1900 });
				firePointer(viewport, 'pointerup', { ...release, clientX: 400, clientY: 190, timeStamp: 1950 });
				await settle(view, 0);

				expect(stateChanged).not.toHaveBeenCalled();
				expect(snapPointChange).not.toHaveBeenCalledWith(null);
				expect(snapPointChange).toHaveBeenCalledWith('100px');
				expect(popup).not.toHaveAttribute('data-ending-style');
			},
		);

		// Not in Base UI, which adds the raw vertical delta here for both directions.
		it.each([
			['down', 1],
			['up', -1],
		] as const)('reports snap point progress toward dismissal while dragging a %s drawer', async (direction, sign) => {
			const { view } = await renderDrawer(
				snapDrawer(`[snapPoints]="['100px', '200px']" [defaultSnapPoint]="'200px'" swipeDirection="${direction}"`),
			);
			const viewport = byTestId('viewport');
			mockHitTest(byTestId('popup'));
			expect(backdrop().style.getPropertyValue('--drawer-swipe-progress')).toBe('0');

			firePointer(viewport, 'pointerdown', { ...press, clientX: 10, clientY: 150 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 10, clientY: 150 + sign });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 10, clientY: 150 + sign * 51 });
			await settle(view, 0);

			expect(Number(backdrop().style.getPropertyValue('--drawer-swipe-progress'))).toBeCloseTo(0.5, 1);
		});

		it('keeps the resting snap point progress when a press never starts a swipe', async () => {
			const { view } = await renderDrawer(
				snapDrawer(
					`[snapPoints]="['100px', '200px']" swipeDirection="down"`,
					'<div brnDrawerContent data-testid="content">Drawer</div>',
				),
			);
			const content = byTestId('content');
			mockHitTest(content);

			expect(backdrop().style.getPropertyValue('--drawer-swipe-progress')).toBe('1');

			// A press inside `brnDrawerContent` never starts a swipe, but it still reaches the gesture's
			// release handler, which reports progress carrying the last drag deltas.
			firePointer(content, 'pointerdown', { ...press, clientX: 100, clientY: 100 });
			firePointer(content, 'pointerup', { ...release, clientX: 100, clientY: 100 });
			await settle(view, 0);

			expect(backdrop().style.getPropertyValue('--drawer-swipe-progress')).toBe('1');
		});

		it('does not resolve snap points before the popup has a measurable height', async () => {
			const { view, stateChanged } = await renderDrawer(
				drawerTemplate('Drawer', {
					drawer: `[snapPoints]="['100px', '200px']" swipeDirection="down"`,
					popup: 'style="height: 0; overflow: hidden"',
				}),
			);
			const viewport = byTestId('viewport');
			mockHitTest(byTestId('popup'));

			firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 1 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 40 });
			firePointer(viewport, 'pointerup', { ...release, clientX: 0, clientY: 40 });
			await settle(view, 0);

			expect(stateChanged).not.toHaveBeenCalled();
		});

		it('falls back to regular dismissal when all snap points are invalid', async () => {
			const { view, stateChanged } = await renderDrawer(
				drawerTemplate('Drawer', { drawer: `[snapPoints]="['50%']"`, popup: 'style="height: 200px"' }),
			);
			const viewport = byTestId('viewport');
			mockHitTest(byTestId('popup'));

			firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 1 });
			firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 140 });
			firePointer(viewport, 'pointerup', { ...release, clientX: 0, clientY: 140 });
			await settle(view, 0);

			expect(stateChanged).toHaveBeenCalledWith('closed');
		});
	});

	it('ends swipe drag when the primary mouse button is released mid-gesture', async () => {
		const { view } = await renderDrawer(drawerTemplate());
		const viewport = byTestId('viewport');

		mockHitTest(byTestId('popup'));
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		await settle(view, 0);
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 8 });
		await settle(view, 0);
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		// Simulate a right-click interruption where the primary button is no longer pressed.
		firePointer(viewport, 'pointermove', { ...drag, buttons: 2, clientX: 0, clientY: 12 });
		await settle(view, 0);
		expect(backdrop()).not.toHaveAttribute('data-swiping');

		firePointer(viewport, 'pointermove', { ...drag, buttons: 0, clientX: 0, clientY: 30 });
		await settle(view, 0);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('ignores swipe input until a popup is mounted', async () => {
		const { view, stateChanged } = await renderDrawer(
			'<div brnDrawer><div *brnDrawerPortal brnDrawerViewport data-testid="viewport"></div></div>',
		);
		const viewport = byTestId('viewport');

		mockHitTest(viewport);
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 100 });
		firePointer(viewport, 'pointerup', { ...release, clientX: 0, clientY: 100 });
		await settle(view, 0);

		expect(stateChanged).not.toHaveBeenCalled();
	});

	it('cleans up when the popup unmounts during an active swipe', async () => {
		const showPopup = signal(true);
		const { view, stateChanged } = await renderDrawer(
			`
				<div brnDrawer [snapPoints]="['100px', '200px']" swipeDirection="down">
					<div *brnDrawerPortal brnDrawerViewport data-testid="viewport">
						@if (showPopup()) {
							<div brnDrawerPopup data-testid="popup">Drawer</div>
						}
					</div>
				</div>
			`,
			{ props: { showPopup } },
		);
		const viewport = byTestId('viewport');

		mockHitTest(byTestId('popup'));
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 20 });
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		showPopup.set(false);
		await settle(view, 0);
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 30 });
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		firePointer(viewport, 'pointerup', { ...release, clientX: 0, clientY: 30 });
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
		expect(stateChanged).not.toHaveBeenCalled();
	});

	it('does not start pointer swipes while a closed drawer remains mounted', async () => {
		const { view, stateChanged } = await renderDrawer(
			drawerTemplate('<button brnDrawerClose data-testid="close">Close</button>'),
		);
		const viewport = byTestId('viewport');
		const popup = byTestId('popup');
		const backdropElement = backdrop();
		mockHitTest(popup);

		byTestId('close').click();
		view.detectChanges();
		// The popup stays rendered until its exit transition finishes.
		expect(popup).toHaveAttribute('data-closed', '');
		expect(popup.isConnected).toBe(true);
		stateChanged.mockClear();

		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 100 });

		expect(backdropElement).not.toHaveAttribute('data-swiping');
		expect(stateChanged).not.toHaveBeenCalled();
	});

	it('clears a selection whose endpoints are popup elements', async () => {
		await renderDrawer(drawerTemplate());
		const popup = byTestId('popup');
		const removeAllRanges = vi.fn();
		vi.spyOn(document, 'getSelection').mockReturnValue({
			anchorNode: popup,
			focusNode: popup,
			isCollapsed: false,
			removeAllRanges,
		} as unknown as Selection);

		mockHitTest(popup);
		firePointer(byTestId('viewport'), 'pointerdown', { ...press, clientX: 0, clientY: 0 });

		expect(removeAllRanges).toHaveBeenCalledTimes(1);
	});

	it('preserves an expanded touch selection whose focus endpoint is in the popup', async () => {
		await renderDrawer(`<span data-testid="outside">Outside</span>${drawerTemplate()}`);
		const popup = byTestId('popup');
		vi.spyOn(document, 'getSelection').mockReturnValue({
			anchorNode: byTestId('outside'),
			focusNode: popup,
			isCollapsed: false,
			containsNode: () => false,
			removeAllRanges: () => undefined,
		} as unknown as Selection);

		mockHitTest(popup);
		fireTouch(popup, 'touchstart', { clientX: 0, clientY: 100 });
		fireTouch(popup, 'touchmove', { clientX: 0, clientY: 140 });

		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('falls back to the viewport when a touch event has no element target', async () => {
		const { view } = await renderDrawer(drawerTemplate());
		const popup = byTestId('popup');
		mockHitTest(popup);

		const touchStart = createTouchEvent(popup, 'touchstart', { clientX: 0, clientY: 100 });
		touchStart.composedPath = () => [window];
		popup.dispatchEvent(touchStart);
		await settle(view, 0);
		fireTouch(popup, 'touchmove', { clientX: 0, clientY: 140 });

		expect(backdrop()).toHaveAttribute('data-swiping', '');
	});

	it('ignores compatibility touch pointer gestures with real displacement', async () => {
		const { view, stateChanged } = await renderDrawer(drawerTemplate());
		const viewport = byTestId('viewport');
		mockHitTest(byTestId('popup'));

		const pointerEvents = [
			['pointerdown', 0, 1],
			['pointermove', 1, 1],
			['pointermove', 100, 1],
			['pointerup', 100, 0],
			['pointercancel', 100, 0],
		] as const;
		for (const [type, clientY, buttons] of pointerEvents) {
			firePointer(viewport, type, { pointerType: 'touch', pointerId: 1, button: 0, buttons, clientX: 0, clientY });
		}
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
		expect(stateChanged).not.toHaveBeenCalled();
	});

	it('publishes and clears swipe progress through brnDrawerProvider', async () => {
		const { view } = await renderDrawer(`
			<div brnDrawerProvider>
				<div brnDrawerIndent data-testid="indent"></div>
				${drawerTemplate('Drawer', { popup: 'style="height: 100px"' })}
			</div>
		`);
		const viewport = byTestId('viewport');
		const indent = byTestId('indent');

		mockHitTest(byTestId('popup'));
		firePointer(viewport, 'pointerdown', { ...press, clientX: 0, clientY: 0 });
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 1 });
		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 40 });
		await settle(view, 0);
		expect(Number.parseFloat(indent.style.getPropertyValue('--drawer-swipe-progress'))).toBeCloseTo(0.39);
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('100px');

		firePointer(viewport, 'pointermove', { ...drag, clientX: 0, clientY: 0 });
		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('');
	});

	// Base UI pins these to "before descendant layout effects". The Angular equivalent is the change
	// detection pass that applies the change: the state must be updated once it returns.
	it('publishes resting snap progress before descendant layout effects', async () => {
		const snapPoint = signal('100px');
		const { view } = await renderDrawer(
			drawerTemplate('Drawer', {
				drawer: `[snapPoints]="['100px', '200px']" [snapPoint]="snapPoint()"`,
				viewport: 'style="height: 200px"',
				popup: 'style="height: 200px"',
			}),
			{ props: { snapPoint } },
		);
		expect(backdrop().style.getPropertyValue('--drawer-swipe-progress')).toBe('1');

		snapPoint.set('200px');
		view.detectChanges();

		expect(backdrop().style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
	});

	it('clears nested progress before descendant layout effects when the child closes', async () => {
		const { view } = await renderDrawer(`
			<div brnDrawer [modal]="false">
				<div *brnDrawerPortal brnDrawerViewport>
					<div brnDrawerPopup data-testid="parent-popup">
						<div brnDrawer [modal]="false" data-testid="child">
							<div *brnDrawerPortal brnDrawerViewport><div brnDrawerPopup>Child drawer</div></div>
						</div>
					</div>
				</div>
			</div>
		`);
		const parentPopup = byTestId('parent-popup');
		const child = getDrawer(view, 'child');

		child.parentDrawer?.onNestedSwipeProgressChange(0.5);
		expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).toBe('0.5');

		child.close();
		view.detectChanges();

		expect(parentPopup.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
	});

	it('clears provider and backdrop swipe state during layout teardown', async () => {
		const showViewport = signal(true);
		const { view } = await renderDrawer(
			`
				<div brnDrawerProvider>
					<div brnDrawerIndent data-testid="indent"></div>
					<div brnDrawer>
						<ng-template brnDrawerPortal>
							@if (showViewport()) {
								<div brnDrawerViewport><div brnDrawerPopup>Drawer</div></div>
							}
						</ng-template>
					</div>
				</div>
			`,
			{ props: { showViewport } },
		);
		const provider = view.fixture.debugElement.query(By.directive(BrnDrawerProvider)).injector.get(BrnDrawerProvider);
		const indent = byTestId('indent');
		const backdropElement = backdrop();

		provider.visualStateStore.set({ swipeProgress: 0.5, frontmostHeight: 100 });
		backdropElement.setAttribute('data-swiping', '');
		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0.5');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('100px');

		showViewport.set(false);
		view.detectChanges();

		expect(indent.style.getPropertyValue('--drawer-swipe-progress')).toBe('0');
		expect(indent.style.getPropertyValue('--drawer-height')).toBe('');
		expect(backdropElement).not.toHaveAttribute('data-swiping');
	});
});
