import {
	backdrop,
	byTestId,
	cleanupOverlays,
	createTouchEvent,
	drawerTemplate,
	firePointer,
	fireTouch,
	mockHitTest,
	type Point,
	renderDrawer,
	settle,
	stubLayout,
	wait,
} from './testing/drawer-test-utils';

/** A vertical scroll container 40px tall, with 120px of content. */
const VERTICAL_SCROLL = `
	<div data-testid="scroll" style="overflow-y: auto; max-height: 40px">
		<div style="height: 120px">Scrollable content</div>
	</div>
`;
/** A horizontal scroll container 40px wide, with 120px of content. */
const HORIZONTAL_SCROLL = `
	<div data-testid="scroll" style="overflow-x: auto; max-width: 40px">
		<div style="width: 120px; height: 40px">Scrollable content</div>
	</div>
`;

/** An SVG shape inside a vertical scroll container. */
const SVG_IN_SCROLL = `
	<div data-testid="scroll" style="overflow-y: auto; max-height: 40px">
		<svg width="20" height="20"><rect data-testid="rect" width="20" height="20" /></svg>
		<div style="height: 120px"></div>
	</div>
`;

describe('BrnDrawerViewport touch scroll arbitration', () => {
	afterEach(() => cleanupOverlays());

	it('uses the event target for non-keyboard touch scroll arbitration', async () => {
		const { view } = await renderDrawer(
			drawerTemplate(
				`
					<div data-testid="scroll" style="overflow-y: auto; max-height: 40px">
						<button type="button" data-testid="button">Action</button>
						<div style="height: 120px"></div>
					</div>
					<div data-testid="other-scroll" style="overflow-y: auto; max-height: 40px">
						<div style="height: 120px"></div>
					</div>
				`,
				{ drawer: 'swipeDirection="down"' },
			),
		);
		const button = byTestId('button');
		const scroll = byTestId('scroll');
		const otherScroll = byTestId('other-scroll');
		stubLayout(scroll, { scrollHeight: 160, clientHeight: 40 });
		scroll.scrollTop = 0;
		stubLayout(otherScroll, { scrollHeight: 160, clientHeight: 40 });
		otherScroll.scrollTop = 40;

		let hitTestCount = 0;
		mockHitTest(() => (++hitTestCount === 1 ? otherScroll : button));
		fireTouch(button, 'touchstart', { clientX: 0, clientY: 0 });
		fireTouch(button, 'touchmove', { clientX: 0, clientY: 40 });
		await settle(view, 0);

		expect(backdrop()).toHaveAttribute('data-swiping', '');
	});

	it('scrolls instead of swiping when a touch drag starts on an SVG inside scrolled content', async () => {
		const { view } = await renderDrawer(drawerTemplate(SVG_IN_SCROLL, { drawer: 'swipeDirection="down"' }));
		const scroll = byTestId('scroll');
		const rect = document.querySelector('[data-testid="rect"]') as Element;
		stubLayout(scroll, { scrollHeight: 160, clientHeight: 40 });
		scroll.scrollTop = 40;

		mockHitTest(rect);
		fireTouch(rect, 'touchstart', { clientX: 0, clientY: 0 });
		const prevented = !fireTouch(rect, 'touchmove', { clientX: 0, clientY: 40 });
		await settle(view, 0);

		expect(prevented).toBe(false);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('does not start a mouse drag swipe from an SVG inside scrollable content', async () => {
		const { view } = await renderDrawer(drawerTemplate(SVG_IN_SCROLL, { drawer: 'swipeDirection="down"' }));
		const viewport = byTestId('viewport');
		const rect = document.querySelector('[data-testid="rect"]') as Element;
		stubLayout(byTestId('scroll'), { scrollHeight: 160, clientHeight: 40 });

		mockHitTest(rect);
		firePointer(rect, 'pointerdown', { button: 0, buttons: 1, pointerId: 1, clientX: 0, clientY: 0 });
		firePointer(viewport, 'pointermove', { pointerId: 1, buttons: 1, clientX: 0, clientY: 40 });
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('dismisses with a touch swipe down that starts on an SVG inside a top-edge scroll container', async () => {
		const { view, stateChanged } = await renderDrawer(
			drawerTemplate(SVG_IN_SCROLL, { drawer: 'swipeDirection="down"' }),
		);
		const scroll = byTestId('scroll');
		const rect = document.querySelector('[data-testid="rect"]') as Element;
		stubLayout(scroll, { scrollHeight: 160, clientHeight: 40 });
		scroll.scrollTop = 0;
		stubLayout(byTestId('popup'), { offsetHeight: 200 });

		mockHitTest(rect);
		fireTouch(rect, 'touchstart', { clientX: 0, clientY: 0 });
		fireTouch(rect, 'touchmove', { clientX: 0, clientY: 140 });
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		fireTouch(rect, 'touchend', { clientX: 0, clientY: 140 });
		await settle(view, 0);

		expect(stateChanged).toHaveBeenCalledWith('closed');
	});

	it('allows clicks on non-interactive elements without data-swipe-ignore', async () => {
		const handleClick = vi.fn();
		const { view, stateChanged } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent><div data-testid="target" (click)="handleClick()">Action</div></div>'),
			{ props: { handleClick } },
		);
		const target = byTestId('target');

		mockHitTest(target);
		fireTouch(target, 'touchstart', { clientX: 0, clientY: 0 });
		firePointer(target, 'pointerdown', { pointerType: 'touch' });
		fireTouch(target, 'touchend', { clientX: 0, clientY: 0 });
		target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		await settle(view, 0);

		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(stateChanged).not.toHaveBeenCalled();
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('does not start touch swipes from elements with data-swipe-ignore', async () => {
		const { view, stateChanged } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent><div data-testid="target" data-swipe-ignore>Action</div></div>'),
		);
		const target = byTestId('target');

		fireTouch(target, 'touchstart', { clientX: 0, clientY: 0 });
		fireTouch(target, 'touchmove', { clientX: 0, clientY: 40 });
		fireTouch(target, 'touchend', { clientX: 0, clientY: 40 });
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
		expect(stateChanged).not.toHaveBeenCalled();
	});

	describe('data-swipe-ignore axis values', () => {
		const renderAxisDrawer = (swipeDirection: 'down' | 'right', content: string) =>
			renderDrawer(drawerTemplate(content, { drawer: `swipeDirection="${swipeDirection}"` }));

		/** Starts a touch at (100, 100) and moves it through `points`, returning each move's dispatch result. */
		function swipe(target: HTMLElement, points: Point[]): boolean[] {
			const hitTest = mockHitTest(target);
			try {
				fireTouch(target, 'touchstart', { clientX: 100, clientY: 100 });
				return points.map((point) => fireTouch(target, 'touchmove', point));
			} finally {
				hitTest.mockRestore();
			}
		}

		it.each([
			['down', 'y', { clientX: 100, clientY: 140 }],
			['right', 'x', { clientX: 140, clientY: 100 }],
		] as const)(
			'ignores %s touch swipes from elements with the drawer axis value "%s"',
			async (swipeDirection, axis, end) => {
				const { view, stateChanged } = await renderAxisDrawer(
					swipeDirection,
					`<div data-testid="target" data-swipe-ignore="${axis}">Carousel</div>`,
				);
				const target = byTestId('target');

				expect(swipe(target, [end])).toEqual([true]);
				expect(backdrop()).not.toHaveAttribute('data-swiping');

				fireTouch(target, 'touchend', end);
				await settle(view, 0);

				expect(stateChanged).not.toHaveBeenCalled();
			},
		);

		it.each([
			['down', 'x', { clientX: 103, clientY: 101 }, { clientX: 140, clientY: 104 }],
			['right', 'y', { clientX: 101, clientY: 103 }, { clientX: 104, clientY: 140 }],
		] as const)(
			'hands cross-axis drags in %s drawers to elements with the value "%s"',
			async (swipeDirection, axis, ambiguous, crossAxis) => {
				const { view, stateChanged } = await renderAxisDrawer(
					swipeDirection,
					`<div data-testid="target" data-swipe-ignore="${axis}">Carousel</div>`,
				);
				const target = byTestId('target');
				const popup = byTestId('popup');
				const handleTargetTouchMove = vi.fn();
				target.addEventListener('touchmove', handleTargetTouchMove);

				expect(swipe(target, [ambiguous, crossAxis])).toEqual([true, true]);
				expect(handleTargetTouchMove).toHaveBeenCalledTimes(2);
				expect(popup.style.getPropertyValue('--drawer-swipe-movement-x')).toBe('0px');
				expect(popup.style.getPropertyValue('--drawer-swipe-movement-y')).toBe('0px');

				fireTouch(target, 'touchend', crossAxis);
				await settle(view, 0);

				expect(stateChanged).not.toHaveBeenCalled();
			},
		);

		it.each(['marked', 'scrollable'] as const)(
			'does not swipe or settle snap points while a %s cross-axis target handles the drag',
			async (kind) => {
				const targetAttributes = kind === 'marked' ? 'data-swipe-ignore="x"' : 'style="overflow-x: auto"';
				const { view, snapPointChange } = await renderDrawer(
					drawerTemplate(`<div data-testid="target" ${targetAttributes}>Carousel</div>`, {
						drawer: '[snapPoints]="[200, 360]"',
					}),
				);
				const target = byTestId('target');
				if (kind === 'scrollable') stubLayout(target, { scrollWidth: 400, clientWidth: 100 });

				const crossAxis = { clientX: 140, clientY: 104 };
				expect(swipe(target, [{ clientX: 103, clientY: 101 }, crossAxis])).toEqual([true, true]);
				view.detectChanges();
				expect(backdrop()).not.toHaveAttribute('data-swiping');
				expect(byTestId('popup')).not.toHaveAttribute('data-swiping');

				fireTouch(target, 'touchend', crossAxis);
				await settle(view, 0);

				expect(snapPointChange).not.toHaveBeenCalled();
			},
		);

		it.each([
			[
				'down',
				'x',
				[
					{ clientX: 101, clientY: 103 },
					{ clientX: 102, clientY: 140 },
					{ clientX: 102, clientY: 200 },
				],
			],
			[
				'right',
				'y',
				[
					{ clientX: 103, clientY: 101 },
					{ clientX: 140, clientY: 102 },
					{ clientX: 200, clientY: 102 },
				],
			],
		] as const)(
			'still swipes %s drawers from elements with the cross-axis value "%s"',
			async (swipeDirection, axis, points) => {
				const { view, stateChanged } = await renderAxisDrawer(
					swipeDirection,
					`<div data-testid="target" data-swipe-ignore="${axis}">Carousel</div>`,
				);
				const target = byTestId('target');

				expect(swipe(target, [...points])).toEqual([true, false, false]);

				fireTouch(target, 'touchend', points[2]);
				await settle(view, 0);

				expect(stateChanged).toHaveBeenCalledTimes(1);
				expect(stateChanged).toHaveBeenCalledWith('closed');
			},
		);

		it('keeps an ancestor that ignores all directions in effect over a nested axis value', async () => {
			const { view, stateChanged } = await renderAxisDrawer(
				'down',
				'<div data-swipe-ignore><div data-testid="target" data-swipe-ignore="x">Carousel</div></div>',
			);
			const target = byTestId('target');
			const end = { clientX: 100, clientY: 140 };

			expect(swipe(target, [end])).toEqual([true]);

			fireTouch(target, 'touchend', end);
			await settle(view, 0);

			expect(stateChanged).not.toHaveBeenCalled();
		});
	});

	// Base UI renders this through a React portal, whose events bubble to the viewport through the
	// React tree. Angular has no such bubbling: an element rendered elsewhere in the DOM (a CDK
	// overlay, or a node moved to the body) only shares the document touchmove listener.
	it('does not prevent native touch scrolling in portaled descendants', async () => {
		const portalContainer = document.body.appendChild(document.createElement('div'));
		try {
			await renderDrawer(
				drawerTemplate('<div brnDrawerContent>Content</div><div data-testid="portaled-popup">Portaled popup</div>'),
			);
			const portaledPopup = byTestId('portaled-popup');
			portalContainer.appendChild(portaledPopup);

			mockHitTest(portaledPopup);
			fireTouch(portaledPopup, 'touchstart', { clientX: 0, clientY: 0 });
			const touchMove = createTouchEvent(portaledPopup, 'touchmove', { clientX: 0, clientY: 40 });
			portaledPopup.dispatchEvent(touchMove);

			expect(touchMove.defaultPrevented).toBe(false);
		} finally {
			portalContainer.remove();
		}
	});

	// Base UI uses a Combobox; this uses a plain scrollable listbox rendered outside the drawer, as a
	// combobox popup would be.
	it('allows touch gestures on a portaled combobox popup without starting drawer swipe', async () => {
		const portalContainer = document.body.appendChild(document.createElement('div'));
		try {
			const { view, stateChanged } = await renderDrawer(
				drawerTemplate(`
					<div brnDrawerContent>
						<div role="listbox" data-testid="listbox" style="max-height: 40px; overflow: auto">
							@for (item of ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']; track item) {
								<div role="option">{{ item }}</div>
							}
						</div>
					</div>
				`),
			);
			const listbox = byTestId('listbox');
			portalContainer.appendChild(listbox);
			expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);

			mockHitTest(listbox);
			const rect = listbox.getBoundingClientRect();
			const clientX = rect.left + rect.width / 2;
			const points = [rect.top + rect.height - 8, rect.top + rect.height / 2, rect.top + 8];

			firePointer(listbox, 'pointerdown', { pointerType: 'touch', buttons: 1, clientX, clientY: points[0] });
			fireTouch(listbox, 'touchstart', { clientX, clientY: points[0] });
			for (const clientY of points.slice(1)) {
				firePointer(listbox, 'pointermove', { pointerType: 'touch', buttons: 1, clientX, clientY });
				fireTouch(listbox, 'touchmove', { clientX, clientY });
			}
			firePointer(listbox, 'pointerup', { pointerType: 'touch', clientX, clientY: points[2] });
			fireTouch(listbox, 'touchend', { clientX, clientY: points[2] });
			await settle(view, 0);

			expect(backdrop()).not.toHaveAttribute('data-swiping');
			expect(stateChanged).not.toHaveBeenCalled();
			expect(listbox).toBeVisible();
		} finally {
			portalContainer.remove();
		}
	});

	it('prevents touchmove at scroll top when swiping down on scrollable content', async () => {
		await renderDrawer(drawerTemplate(VERTICAL_SCROLL, { drawer: 'swipeDirection="down"' }));
		const scroll = byTestId('scroll');
		const handleTouchMove = vi.fn();
		scroll.addEventListener('touchmove', handleTouchMove);
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 0;

		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 0 });
		const prevented = fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 10 });

		expect(prevented).toBe(false);
		expect(handleTouchMove).not.toHaveBeenCalled();
	});

	it('prevents touchmove at scroll bottom when swiping up on scrollable content', async () => {
		const { view } = await renderDrawer(drawerTemplate(VERTICAL_SCROLL, { drawer: 'swipeDirection="up"' }));
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 80;

		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 20 });
		const touchMove = createTouchEvent(scroll, 'touchmove', { clientX: 0, clientY: 10 });
		scroll.dispatchEvent(touchMove);
		await settle(view, 0);

		expect(touchMove.defaultPrevented).toBe(true);
		expect(backdrop()).toHaveAttribute('data-swiping');
	});

	it('prevents touchmove when a scrollable ancestor wraps the popup at the top', async () => {
		const { view } = await renderDrawer(`
			<div brnDrawer swipeDirection="down">
				<div *brnDrawerPortal brnDrawerViewport>
					<div data-testid="scroll" style="overflow-y: auto; max-height: 40px">
						<div brnDrawerPopup>
							<div brnDrawerContent><span data-testid="item">Scrollable content</span></div>
						</div>
					</div>
				</div>
			</div>
		`);
		const scroll = byTestId('scroll');
		const item = byTestId('item');
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 0;

		mockHitTest(item);
		fireTouch(item, 'touchstart', { clientX: 0, clientY: 0 });
		const touchMove = createTouchEvent(item, 'touchmove', { clientX: 0, clientY: 10 });
		item.dispatchEvent(touchMove);
		await settle(view, 0);

		expect(touchMove.defaultPrevented).toBe(true);
		expect(backdrop()).toHaveAttribute('data-swiping');
	});

	// Base UI asserts the backdrop; spartan only renders one for `modal: true`, so this checks the
	// popup's `data-swiping` instead.
	it('starts a swipe away from the page scroll edge when the body is a scroll container', async () => {
		const html = document.documentElement;
		const { body } = document;
		const previousHtmlStyle = html.style.cssText;
		const previousBodyStyle = body.style.cssText;
		// A common reset that turns `body` into a real scroll container instead of letting its
		// overflow propagate to the viewport.
		html.style.cssText = 'height: 100%; overflow-y: auto';
		body.style.cssText = 'height: 100%; overflow-y: auto';

		try {
			const { view } = await renderDrawer(`
				<div style="height: 5000px"></div>
				<div brnDrawer [modal]="false" swipeDirection="down" [snapPoints]="[300, 100]">
					<div
						*brnDrawerPortal
						brnDrawerViewport
						style="position: fixed; inset: 0; pointer-events: none"
					>
						<div
							brnDrawerPopup
							data-testid="popup"
							style="position: absolute; left: 0; right: 0; bottom: 0; height: 300px; pointer-events: auto; transform: translateY(calc(var(--drawer-snap-point-offset) + var(--drawer-swipe-movement-y)))"
						>
							<div data-testid="drag" style="height: 100px">Drag</div>
						</div>
					</div>
				</div>
			`);
			const popup = byTestId('popup');
			const drag = byTestId('drag');
			await settle(view, 50);
			expect(popup.style.getPropertyValue('--drawer-snap-point-offset')).toBe('0px');

			// Refusing swipes away from the page scroll edge would fail here: being at the top with a
			// scrollable body is the precondition.
			expect(body.scrollTop).toBe(0);
			expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);

			const rect = drag.getBoundingClientRect();
			const clientX = rect.left + 20;
			const clientY = rect.top + 80;
			fireTouch(drag, 'touchstart', { clientX, clientY });
			fireTouch(drag, 'touchmove', { clientX, clientY: clientY - 30 });
			await settle(view, 0);

			expect(popup).toHaveAttribute('data-swiping', '');
			fireTouch(drag, 'touchend', { clientX, clientY: clientY - 30 });
		} finally {
			html.style.cssText = previousHtmlStyle;
			body.style.cssText = previousBodyStyle;
		}
	});

	it('prevents touchmove when there is no scroll container', async () => {
		const { view } = await renderDrawer(
			drawerTemplate('<div brnDrawerContent>Content</div>', { drawer: 'swipeDirection="down"' }),
		);
		const popup = byTestId('popup');

		mockHitTest(popup);
		fireTouch(popup, 'touchstart', { clientX: 0, clientY: 0 });
		const touchMove = createTouchEvent(popup, 'touchmove', { clientX: 0, clientY: 10 });
		popup.dispatchEvent(touchMove);
		await settle(view, 0);

		expect(touchMove.defaultPrevented).toBe(true);
		expect(backdrop()).toHaveAttribute('data-swiping');
	});

	it('does not block touchmove on native range inputs', async () => {
		const { view } = await renderDrawer(
			drawerTemplate('<input type="range" data-testid="range" />', { drawer: 'swipeDirection="down"' }),
		);
		const range = byTestId('range');

		fireTouch(range, 'touchstart', { clientX: 0, clientY: 0 });
		const dispatched = fireTouch(range, 'touchmove', { clientX: 20, clientY: 0 });
		await settle(view, 0);

		expect(dispatched).toBe(true);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	describe('text selection handles', () => {
		/** Touches the popup and drags 10px down, returning whether the move was left alone. */
		async function dragPopup(view: Awaited<ReturnType<typeof renderDrawer>>['view']) {
			const popup = byTestId('popup');
			mockHitTest(popup);
			fireTouch(popup, 'touchstart', { clientX: 0, clientY: 0 });
			expect(backdrop()).not.toHaveAttribute('data-swiping');

			const dispatched = fireTouch(popup, 'touchmove', { clientX: 0, clientY: 10 });
			await settle(view, 0);
			return dispatched;
		}

		it.each([
			['input', '<input data-testid="field" value="Selectable text" />'],
			['textarea', '<textarea data-testid="field">Selectable text</textarea>'],
		])('does not start swiping when adjusting %s selection handles', async (_kind, content) => {
			const { view } = await renderDrawer(drawerTemplate(content, { drawer: 'swipeDirection="down"' }));
			const field = byTestId<HTMLInputElement>('field');
			field.focus();
			field.setSelectionRange(0, 5);

			expect(await dragPopup(view)).toBe(true);
			expect(backdrop()).not.toHaveAttribute('data-swiping');
		});

		it.each([
			['contenteditable', '<div contenteditable="true" data-testid="text">Selectable text</div>'],
			['regular text', '<span data-testid="text">Selectable text</span>'],
		])('does not start swiping when adjusting %s selection handles', async (kind, content) => {
			const { view } = await renderDrawer(drawerTemplate(content, { drawer: 'swipeDirection="down"' }));
			const text = byTestId('text');
			if (kind === 'contenteditable') text.focus();

			const selection = window.getSelection() as Selection;
			const range = document.createRange();
			range.setStart(text.firstChild as Node, 0);
			range.setEnd(text.firstChild as Node, 5);
			selection.removeAllRanges();
			selection.addRange(range);

			expect(await dragPopup(view)).toBe(true);
			expect(backdrop()).not.toHaveAttribute('data-swiping');
		});
	});

	it('allows touchmove when scrolling down from scroll top', async () => {
		await renderDrawer(drawerTemplate(VERTICAL_SCROLL, { drawer: 'swipeDirection="down"' }));
		const scroll = byTestId('scroll');
		const handleTouchMove = vi.fn();
		scroll.addEventListener('touchmove', handleTouchMove);
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 0;

		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 0 });
		const prevented = fireTouch(scroll, 'touchmove', { clientX: 0, clientY: -10 });

		expect(prevented).toBe(true);
		expect(handleTouchMove).toHaveBeenCalledTimes(1);
	});

	it('does not start an opposite-direction swipe from scroll bottom for down drawers with snap points', async () => {
		const { view } = await renderDrawer(
			drawerTemplate(VERTICAL_SCROLL, { drawer: `swipeDirection="down" [snapPoints]="['100px', 1]"` }),
		);
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 80;

		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 40 });
		const moveAllowed = fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 20 });
		await settle(view, 0);

		expect(moveAllowed).toBe(true);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('does not start an opposite-direction swipe from scroll right edge for right drawers', async () => {
		const { view } = await renderDrawer(drawerTemplate(HORIZONTAL_SCROLL, { drawer: 'swipeDirection="right"' }));
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollWidth: 120, clientWidth: 40 });
		scroll.scrollLeft = 80;

		// Base UI relies on real hit testing here, where (40, 0) falls on the page margin outside its
		// popup. The overlay pane sits at (0, 0), where it lands on the popup beside the 40px wide
		// scroller instead, so the hit test is pinned to the touched scroller.
		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', { clientX: 40, clientY: 0 });
		const moveAllowed = fireTouch(scroll, 'touchmove', { clientX: 20, clientY: 0 });
		await settle(view, 0);

		expect(moveAllowed).toBe(true);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('starts swipe-to-dismiss after a scrollable container reaches the dismiss edge', async () => {
		const { view } = await renderDrawer(drawerTemplate(VERTICAL_SCROLL, { drawer: 'swipeDirection="down"' }));
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 30;

		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 30 });

		const firstMoveAllowed = fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 40 });
		expect(firstMoveAllowed).toBe(true);
		expect(backdrop()).not.toHaveAttribute('data-swiping');

		scroll.scrollTop = 0;
		const secondMoveAllowed = fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 50 });
		expect(secondMoveAllowed).toBe(false);
		await settle(view, 0);

		expect(backdrop()).toHaveAttribute('data-swiping', '');
	});

	it.each([
		{
			title: 'dismisses from a top-edge scroll container with a touch swipe down',
			direction: 'down',
			scroll: VERTICAL_SCROLL,
			setup: (scroll: HTMLElement, popup: HTMLElement) => {
				stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
				scroll.scrollTop = 0;
				stubLayout(popup, { offsetHeight: 200 });
			},
			start: { clientX: 0, clientY: 0 },
			end: { clientX: 0, clientY: 140 },
		},
		{
			title: 'dismisses from a bottom-edge scroll container with a touch swipe up',
			direction: 'up',
			scroll: VERTICAL_SCROLL,
			setup: (scroll: HTMLElement, popup: HTMLElement) => {
				stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
				scroll.scrollTop = 80;
				stubLayout(popup, { offsetHeight: 200 });
			},
			start: { clientX: 0, clientY: 140 },
			end: { clientX: 0, clientY: 0 },
		},
		{
			title: 'dismisses from a left-edge horizontal scroll container with a touch swipe right',
			direction: 'right',
			scroll: HORIZONTAL_SCROLL,
			setup: (scroll: HTMLElement, popup: HTMLElement) => {
				stubLayout(scroll, { scrollWidth: 120, clientWidth: 40 });
				scroll.scrollLeft = 0;
				stubLayout(popup, { offsetWidth: 200 });
			},
			start: { clientX: 0, clientY: 0 },
			end: { clientX: 140, clientY: 0 },
		},
		{
			title: 'dismisses from a right-edge horizontal scroll container with a touch swipe left',
			direction: 'left',
			scroll: HORIZONTAL_SCROLL,
			setup: (scroll: HTMLElement, popup: HTMLElement) => {
				stubLayout(scroll, { scrollWidth: 120, clientWidth: 40 });
				scroll.scrollLeft = 80;
				stubLayout(popup, { offsetWidth: 200 });
			},
			start: { clientX: 140, clientY: 0 },
			end: { clientX: 0, clientY: 0 },
		},
	])('$title', async ({ direction, scroll: content, setup, start, end }) => {
		const { view, stateChanged } = await renderDrawer(
			drawerTemplate(content, { drawer: `swipeDirection="${direction}"` }),
		);
		const scroll = byTestId('scroll');
		setup(scroll, byTestId('popup'));

		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', start);
		fireTouch(scroll, 'touchmove', end);
		expect(backdrop()).toHaveAttribute('data-swiping', '');

		fireTouch(scroll, 'touchend', end);
		await settle(view, 0);

		expect(stateChanged).toHaveBeenCalledWith('closed');
	});

	it.each(['HTML scroller', 'SVG scroller', 'axis ignore marker'] as const)(
		'expands a collapsed sheet when the first move from a %s leaves the popup',
		async (kind) => {
			const scrollAttributes = kind === 'axis ignore marker' ? 'data-swipe-ignore="x"' : 'style="overflow-x: auto"';
			const target =
				kind === 'SVG scroller'
					? '<svg><rect data-testid="target" width="120" height="40" /></svg>'
					: '<div data-testid="target">Swipe here</div>';
			const { view, snapPointChange } = await renderDrawer(
				drawerTemplate(`<div data-testid="scroll" ${scrollAttributes}>${target}</div>`, {
					drawer: `swipeDirection="down" [snapPoints]="['100px', '200px']" defaultSnapPoint="100px"`,
					viewport: 'style="height: 400px"',
					popup: 'style="height: 200px"',
				}),
			);
			const popup = byTestId('popup');
			const viewport = byTestId('viewport');
			const targetElement = document.querySelector('[data-testid="target"]') as HTMLElement;
			if (kind !== 'axis ignore marker') stubLayout(byTestId('scroll'), { scrollWidth: 120, clientWidth: 40 });
			expect(popup.style.getPropertyValue('--drawer-snap-point-offset')).toBe('100px');

			// The popup starts at y=300. Touch events keep their original target after leaving it.
			mockHitTest((_x, y) => (y >= 300 ? targetElement : viewport));

			fireTouch(targetElement, 'touchstart', { clientX: 100, clientY: 305 });
			expect(backdrop()).not.toHaveAttribute('data-swiping');

			fireTouch(targetElement, 'touchmove', { clientX: 100, clientY: 275 });
			expect(backdrop()).toHaveAttribute('data-swiping');

			fireTouch(targetElement, 'touchmove', { clientX: 100, clientY: 125 });
			expect(Number.parseFloat(popup.style.getPropertyValue('--drawer-swipe-movement-y'))).toBeLessThan(0);

			fireTouch(targetElement, 'touchend', { clientX: 100, clientY: 125 });
			await settle(view, 0);
			expect(snapPointChange).toHaveBeenCalledWith('200px');

			// The next touch starts and stays outside; it must not inherit the previous eligibility.
			snapPointChange.mockClear();
			fireTouch(viewport, 'touchstart', { clientX: 100, clientY: 275 });
			fireTouch(viewport, 'touchmove', { clientX: 100, clientY: 125 });
			expect(backdrop()).not.toHaveAttribute('data-swiping');
			fireTouch(viewport, 'touchend', { clientX: 100, clientY: 125 });
			await settle(view, 0);
			expect(snapPointChange).not.toHaveBeenCalled();
		},
	);

	it('allows horizontal swipe dismiss from a vertical scroll container', async () => {
		const { view } = await renderDrawer(drawerTemplate(VERTICAL_SCROLL, { drawer: 'swipeDirection="right"' }));
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
		scroll.scrollTop = 20;

		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 20 });
		fireTouch(scroll, 'touchmove', { clientX: 20, clientY: 20 });
		await settle(view, 0);

		expect(backdrop()).toHaveAttribute('data-swiping', '');
	});

	describe('over cross-axis scrollable content in a right drawer', () => {
		async function setup() {
			const rendered = await renderDrawer(drawerTemplate(VERTICAL_SCROLL, { drawer: 'swipeDirection="right"' }));
			const scroll = byTestId('scroll');
			stubLayout(scroll, { scrollHeight: 120, clientHeight: 40 });
			mockHitTest(scroll);
			fireTouch(scroll, 'touchstart', { clientX: 100, clientY: 100 });
			return { ...rendered, scroll, popup: byTestId('popup') };
		}

		it('does not prevent a sub-slop first touchmove over cross-axis scrollable content', async () => {
			const { view, scroll } = await setup();

			// Below the axis-attribution slop the gesture cannot be claimed yet: preventing the first
			// cancelable touchmove on iOS cancels native scrolling for the entire gesture.
			expect(fireTouch(scroll, 'touchmove', { clientX: 100, clientY: 97 })).toBe(true);
			// Past the slop on the cross axis, native vertical scrolling stays preserved.
			expect(fireTouch(scroll, 'touchmove', { clientX: 100, clientY: 60 })).toBe(true);

			fireTouch(scroll, 'touchend', { clientX: 100, clientY: 60 });
			await settle(view, 0);
		});

		it('claims the gesture once the drawer axis passes the slop over cross-axis scrollable content', async () => {
			const { view, scroll } = await setup();

			expect(fireTouch(scroll, 'touchmove', { clientX: 103, clientY: 101 })).toBe(true);
			expect(fireTouch(scroll, 'touchmove', { clientX: 112, clientY: 101 })).toBe(false);

			fireTouch(scroll, 'touchend', { clientX: 112, clientY: 101 });
			await settle(view, 0);
		});

		it('yields the gesture when the browser commits to a native cross-axis scroll', async () => {
			const { view, scroll } = await setup();

			fireTouch(scroll, 'touchmove', { clientX: 100, clientY: 97 });
			// A non-cancelable touchmove (still below the slop) means the browser committed the gesture
			// to a native scroll.
			fireTouch(scroll, 'touchmove', { clientX: 100, clientY: 96 }, { cancelable: false });

			// Even a decisive drawer-axis move afterwards must not be claimed.
			expect(fireTouch(scroll, 'touchmove', { clientX: 140, clientY: 96 })).toBe(true);

			fireTouch(scroll, 'touchend', { clientX: 140, clientY: 96 });
			await settle(view, 0);
		});

		it('keeps tracking the finger when a claimed drag returns inside the slop', async () => {
			const { view, scroll, popup } = await setup();

			fireTouch(scroll, 'touchmove', { clientX: 120, clientY: 100 });
			fireTouch(scroll, 'touchmove', { clientX: 150, clientY: 100 });
			expect(popup.style.getPropertyValue('--drawer-swipe-movement-x')).toBe('30px');

			// The slop is measured from the touch origin, so a claimed drag that travels back inside it
			// must not be re-arbitrated: the popup has to keep following the finger.
			expect(fireTouch(scroll, 'touchmove', { clientX: 103, clientY: 100 })).toBe(false);
			expect(Number.parseFloat(popup.style.getPropertyValue('--drawer-swipe-movement-x'))).toBeLessThan(0);

			fireTouch(scroll, 'touchend', { clientX: 103, clientY: 100 });
			await settle(view, 0);
		});

		it('keeps driving a claimed drag through a non-cancelable touchmove', async () => {
			const { view, scroll, popup } = await setup();

			fireTouch(scroll, 'touchmove', { clientX: 150, clientY: 100 });
			fireTouch(scroll, 'touchmove', { clientX: 200, clientY: 100 });
			expect(popup.style.getPropertyValue('--drawer-swipe-movement-x')).toBe('50px');

			// Once the drawer axis owns the gesture, a non-cancelable move no longer means the browser
			// took it for a native scroll, so the drag must not be abandoned.
			fireTouch(scroll, 'touchmove', { clientX: 250, clientY: 100 }, { cancelable: false });
			expect(popup.style.getPropertyValue('--drawer-swipe-movement-x')).toBe('100px');

			expect(fireTouch(scroll, 'touchmove', { clientX: 300, clientY: 100 })).toBe(false);
			expect(popup.style.getPropertyValue('--drawer-swipe-movement-x')).toBe('150px');

			fireTouch(scroll, 'touchend', { clientX: 300, clientY: 100 });
			await settle(view, 0);
		});
	});

	it('does not lock vertical swipe after minor cross-axis jitter in down drawers', async () => {
		const { view } = await renderDrawer(
			drawerTemplate(
				`
					<div data-testid="scroll" style="overflow-x: auto; width: 40px">
						<div style="width: 120px; height: 40px">Scrollable content</div>
					</div>
				`,
				{ drawer: 'swipeDirection="down"' },
			),
		);
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollWidth: 120, clientWidth: 40 });
		scroll.scrollLeft = 0;

		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 0 });
		fireTouch(scroll, 'touchmove', { clientX: 4, clientY: 3 });
		fireTouch(scroll, 'touchmove', { clientX: 4, clientY: 28 });
		await settle(view, 0);

		expect(backdrop()).toHaveAttribute('data-swiping', '');
	});

	it('does not hijack cross-axis gestures from mixed-axis scroll containers', async () => {
		const { view } = await renderDrawer(
			drawerTemplate(
				`
					<div data-testid="scroll" style="overflow: auto; width: 40px; height: 40px">
						<div style="width: 120px; height: 120px">Scrollable content</div>
					</div>
				`,
				{ drawer: 'swipeDirection="down"' },
			),
		);
		const scroll = byTestId('scroll');
		stubLayout(scroll, { scrollHeight: 120, clientHeight: 40, scrollWidth: 120, clientWidth: 40 });
		scroll.scrollTop = 0;
		scroll.scrollLeft = 40;

		mockHitTest(scroll);
		fireTouch(scroll, 'touchstart', { clientX: 40, clientY: 0 });
		fireTouch(scroll, 'touchmove', { clientX: 10, clientY: 20 });
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	// These use real layout and hit testing.
	it.each([
		{
			title: 'does not block vertical scrolling in right drawers when only vertical overflow exists',
			direction: 'right',
			axis: 'vertical',
		},
		{
			title: 'does not block vertical scrolling in left drawers when only vertical overflow exists',
			direction: 'left',
			axis: 'vertical',
		},
		{
			title: 'does not block horizontal scrolling in down drawers when only horizontal overflow exists',
			direction: 'down',
			axis: 'horizontal',
		},
		{
			title: 'does not block horizontal scrolling in up drawers when only horizontal overflow exists',
			direction: 'up',
			axis: 'horizontal',
		},
	])('$title', async ({ direction, axis }) => {
		const vertical = axis === 'vertical';
		const content = vertical
			? `<div data-testid="scroll" style="overflow-y: auto; height: 40px"><div style="height: 120px">Scrollable content</div></div>`
			: `<div data-testid="scroll" style="overflow-x: auto; width: 40px"><div style="width: 120px; height: 40px">Scrollable content</div></div>`;
		const { view } = await renderDrawer(drawerTemplate(content, { drawer: `swipeDirection="${direction}"` }));
		const scroll = byTestId('scroll');

		fireTouch(scroll, 'touchstart', vertical ? { clientX: 0, clientY: 20 } : { clientX: 20, clientY: 0 });
		const dispatched = fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 0 });
		await settle(view, 0);

		expect(dispatched).toBe(true);
		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('leaves pinch-zoom touchmove to the browser', async () => {
		const { view } = await renderDrawer(drawerTemplate());
		const popup = byTestId('popup');

		fireTouch(popup, 'touchstart', { clientX: 0, clientY: 100 });
		const pinch = [
			{ clientX: 0, clientY: 80 },
			{ clientX: 20, clientY: 80 },
		];
		expect(fireTouch(popup, 'touchmove', pinch)).toBe(true);
		await settle(view, 0);

		expect(backdrop()).not.toHaveAttribute('data-swiping');
	});

	it('prevents page scrolling for a non-overflowing touch scroll container', async () => {
		await renderDrawer(drawerTemplate('<div data-testid="scroll" style="overflow-y: auto">Content</div>'));
		const scroll = byTestId('scroll');
		stubLayout(scroll, { clientHeight: 100, scrollHeight: 200 });
		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 100 });
		stubLayout(scroll, { scrollHeight: 100 });

		const touchMove = createTouchEvent(scroll, 'touchmove', { clientX: 0, clientY: 80 });
		expect(scroll.dispatchEvent(touchMove)).toBe(false);
		await wait();
		expect(touchMove.defaultPrevented).toBe(true);

		expect(fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 60 }, { cancelable: false })).toBe(true);
	});

	// Base UI listens on a React ancestor of the drawer; the overlay container is the DOM ancestor of
	// the drawer's overlay.
	it('keeps a claimed scroll-edge swipe moving through non-cancelable events', async () => {
		await renderDrawer(
			drawerTemplate(`
				<div data-testid="scroll" style="height: 100px; overflow-y: auto">
					<div style="height: 300px"></div>
				</div>
			`),
		);
		const handleParentTouchMove = vi.fn();
		document.querySelector('.cdk-overlay-container')?.addEventListener('touchmove', handleParentTouchMove);
		const scroll = byTestId('scroll');
		stubLayout(scroll, { clientHeight: 100, scrollHeight: 300 });
		scroll.scrollTop = 0;

		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 100 });
		fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 120 });
		handleParentTouchMove.mockClear();

		expect(fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 130 }, { cancelable: false })).toBe(true);
		await wait();
		expect(handleParentTouchMove).not.toHaveBeenCalled();

		expect(fireTouch(scroll, 'touchmove', { clientX: 0, clientY: 140 })).toBe(false);
	});

	it('does not claim a stationary touch in overflowing content', async () => {
		await renderDrawer(
			drawerTemplate(`
				<div data-testid="scroll" style="height: 100px; overflow-y: auto">
					<div style="height: 300px"></div>
				</div>
			`),
		);
		const scroll = byTestId('scroll');
		stubLayout(scroll, { clientHeight: 100, scrollHeight: 300 });

		fireTouch(scroll, 'touchstart', { clientX: 0, clientY: 100 });
		const touchMove = createTouchEvent(scroll, 'touchmove', { clientX: 0, clientY: 100 });

		expect(scroll.dispatchEvent(touchMove)).toBe(true);
		await wait();
		expect(touchMove.defaultPrevented).toBe(false);
	});
});
