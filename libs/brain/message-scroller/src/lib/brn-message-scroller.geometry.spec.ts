import { afterEach, describe, expect, it } from 'vitest';

import {
	getContentBlockPadding,
	getContentBottom,
	getElementScrollTop,
	getElementTop,
	getElementViewportTop,
	getFirstVisibleMessageItem,
	getFlexGap,
	getLastScrollAnchor,
	getMaxScrollTop,
	getMessageScrollerItems,
	getMessageScrollerScrollable,
	getMessageScrollerVisibilityState,
	getNewScrollAnchor,
	getTailSpacerHeight,
	getUnanchoredScrollAnchor,
	hasMultipleNewScrollAnchors,
} from './brn-message-scroller.geometry';

// jsdom / headless browsers may not compute layout, so each element's rect, scroll
// position, and dimensions are stubbed directly. Rects are expressed in viewport
// (client) coordinates and shift with the owning viewport's scrollTop.

type RectInput = {
	top: number;
	height: number;
};

const cleanups: Array<() => void> = [];

afterEach(() => {
	while (cleanups.length > 0) {
		cleanups.pop()?.();
	}
});

// Override window.getComputedStyle once per test so padding stubs read from
// data attributes set on the element.
function stubComputedStyle() {
	const original = window.getComputedStyle;

	window.getComputedStyle = ((element: Element) => {
		const style = original(element);

		if (element instanceof HTMLElement && element.dataset['paddingStart']) {
			return {
				...style,
				gap: '0px',
				rowGap: '0px',
				paddingBlockStart: `${element.dataset['paddingStart']}px`,
				paddingTop: `${element.dataset['paddingStart']}px`,
				paddingBlockEnd: `${element.dataset['paddingEnd'] ?? '0'}px`,
				paddingBottom: `${element.dataset['paddingEnd'] ?? '0'}px`,
			} as CSSStyleDeclaration;
		}

		return style;
	}) as typeof window.getComputedStyle;

	cleanups.push(() => {
		window.getComputedStyle = original;
	});
}

function setRect(element: HTMLElement, rect: RectInput) {
	element.getBoundingClientRect = () =>
		({
			top: rect.top,
			bottom: rect.top + rect.height,
			height: rect.height,
			left: 0,
			right: 0,
			width: 0,
			x: 0,
			y: rect.top,
			toJSON: () => ({}),
		}) as DOMRect;
}

function setClientHeight(element: HTMLElement, height: number) {
	Object.defineProperty(element, 'clientHeight', {
		configurable: true,
		get: () => height,
	});
}

// Build a viewport/content/items fixture. The viewport rect is anchored at
// `viewportTop` in client space; item rects are given in viewport-relative
// terms and offset by viewportTop so getElementTop math lines up with scrollTop.
function createFixture(options: {
	viewportTop?: number;
	viewportHeight: number;
	scrollTop?: number;
	scrollHeight?: number;
	contentPaddingStart?: number;
	contentPaddingEnd?: number;
	items: Array<{
		messageId?: string;
		scrollAnchor?: boolean;
		top: number;
		height: number;
	}>;
}) {
	const viewportTop = options.viewportTop ?? 0;
	const scrollTop = options.scrollTop ?? 0;

	const viewport = document.createElement('div');
	const content = document.createElement('div');
	const spacer = document.createElement('div');

	viewport.appendChild(content);
	content.appendChild(spacer);

	setRect(viewport, { top: viewportTop, height: options.viewportHeight });
	setClientHeight(viewport, options.viewportHeight);

	// Real browsers clamp scrollTop when content does not overflow. Stub it so
	// fixtures can assert geometry independently of layout (matches jsdom tests).
	let viewportScrollTop = scrollTop;
	Object.defineProperty(viewport, 'scrollTop', {
		configurable: true,
		get: () => viewportScrollTop,
		set: (value: number) => {
			viewportScrollTop = value;
		},
	});

	if (typeof options.scrollHeight === 'number') {
		Object.defineProperty(viewport, 'scrollHeight', {
			configurable: true,
			get: () => options.scrollHeight as number,
		});
	} else {
		// Ensure scrollHeight exceeds clientHeight so engines that still consult it
		// treat the viewport as scrollable.
		Object.defineProperty(viewport, 'scrollHeight', {
			configurable: true,
			get: () => Math.max(options.viewportHeight + scrollTop + 1, 1000),
		});
	}

	if (typeof options.contentPaddingStart === 'number') {
		content.dataset['paddingStart'] = String(options.contentPaddingStart);
		content.dataset['paddingEnd'] = String(options.contentPaddingEnd ?? 0);
	}

	const items = options.items.map((item) => {
		const element = document.createElement('div');

		if (item.messageId) {
			element.dataset['messageId'] = item.messageId;
		}

		element.dataset['scrollAnchor'] = item.scrollAnchor ? 'true' : 'false';
		// Item rects are in client coordinates: viewport-relative top shifted by the
		// viewport's own top so getElementTop adds back scrollTop correctly.
		setRect(element, { top: viewportTop + item.top, height: item.height });
		content.insertBefore(element, spacer);

		return element;
	});

	return { viewport, content, spacer, items };
}

function createItems(specs: Array<{ id: string; anchor?: boolean }>): HTMLElement[] {
	return specs.map((spec) => {
		const element = document.createElement('div');
		element.dataset['messageId'] = spec.id;
		element.dataset['scrollAnchor'] = spec.anchor ? 'true' : 'false';
		return element;
	});
}

describe('getElementScrollTop', () => {
	it('aligns to start by subtracting content padding and margin', () => {
		stubComputedStyle();
		const { items, spacer, viewport } = createFixture({
			viewportHeight: 200,
			scrollTop: 0,
			contentPaddingStart: 10,
			contentPaddingEnd: 10,
			items: [{ messageId: 'a', top: 100, height: 50 }],
		});

		// elementTop = 100; minus padding.start (10) minus scrollMargin (5).
		expect(
			getElementScrollTop({
				align: 'start',
				element: items[0],
				scrollMargin: 5,
				spacer,
				viewport,
			}),
		).toBe(85);
	});

	it('centers the element within the padded inset', () => {
		stubComputedStyle();
		const { items, spacer, viewport } = createFixture({
			viewportHeight: 200,
			scrollTop: 0,
			contentPaddingStart: 20,
			contentPaddingEnd: 20,
			items: [{ messageId: 'a', top: 300, height: 40 }],
		});

		// insetHeight = 200 - 20 - 20 = 160; offset = (160 - 40) / 2 = 60.
		// elementTop (300) - padding.start (20) - 60 - scrollMargin (0) = 220.
		expect(
			getElementScrollTop({
				align: 'center',
				element: items[0],
				scrollMargin: 0,
				spacer,
				viewport,
			}),
		).toBe(220);
	});

	it('aligns to end against the viewport bottom', () => {
		stubComputedStyle();
		const { items, spacer, viewport } = createFixture({
			viewportHeight: 200,
			scrollTop: 0,
			contentPaddingStart: 0,
			contentPaddingEnd: 8,
			items: [{ messageId: 'a', top: 300, height: 50 }],
		});

		// elementTop (300) - clientHeight (200) + height (50) + padding.end (8)
		//   + scrollMargin (0) = 158.
		expect(
			getElementScrollTop({
				align: 'end',
				element: items[0],
				scrollMargin: 0,
				spacer,
				viewport,
			}),
		).toBe(158);
	});

	it('returns the current scrollTop when nearest and already visible', () => {
		stubComputedStyle();
		const { items, spacer, viewport } = createFixture({
			viewportHeight: 200,
			viewportTop: 0,
			scrollTop: 50,
			contentPaddingStart: 0,
			contentPaddingEnd: 0,
			// Element top relative to viewport is 60, so in content space it sits at
			// scrollTop (50) + 60 = 110, fully inside [50, 250].
			items: [{ messageId: 'a', top: 60, height: 40 }],
		});

		expect(
			getElementScrollTop({
				align: 'nearest',
				element: items[0],
				scrollMargin: 0,
				spacer,
				viewport,
			}),
		).toBe(50);
	});

	it('scrolls up to reveal an element above the viewport when nearest', () => {
		stubComputedStyle();
		const { items, spacer, viewport } = createFixture({
			viewportHeight: 200,
			viewportTop: 0,
			scrollTop: 300,
			contentPaddingStart: 0,
			contentPaddingEnd: 0,
			// Relative top -100 means content-space top is 300 + (-100) = 200, which
			// is above viewportTop (scrollTop 300), so it must scroll up to 200.
			items: [{ messageId: 'a', top: -100, height: 40 }],
		});

		expect(
			getElementScrollTop({
				align: 'nearest',
				element: items[0],
				scrollMargin: 0,
				spacer,
				viewport,
			}),
		).toBe(200);
	});
});

describe('getContentBottom', () => {
	it('returns padding sum when there are no items', () => {
		stubComputedStyle();
		const { content, spacer, viewport } = createFixture({
			viewportHeight: 200,
			scrollTop: 0,
			contentPaddingStart: 12,
			contentPaddingEnd: 8,
			items: [],
		});

		expect(getContentBottom({ content, spacer, viewport })).toBe(20);
	});

	it('measures from the lowest item bottom plus end padding', () => {
		stubComputedStyle();
		const { content, spacer, viewport } = createFixture({
			viewportHeight: 200,
			viewportTop: 0,
			scrollTop: 30,
			contentPaddingStart: 0,
			contentPaddingEnd: 16,
			items: [
				{ messageId: 'a', top: 0, height: 100 },
				{ messageId: 'b', top: 100, height: 150 },
			],
		});

		// Lowest item bottom in client space is 250; minus viewportRect.top (0)
		// plus scrollTop (30) plus padding.end (16) = 296.
		expect(getContentBottom({ content, spacer, viewport })).toBe(296);
	});

	it('excludes the spacer from the measurement', () => {
		stubComputedStyle();
		const { content, spacer, viewport } = createFixture({
			viewportHeight: 200,
			scrollTop: 0,
			contentPaddingStart: 0,
			contentPaddingEnd: 0,
			items: [{ messageId: 'a', top: 0, height: 80 }],
		});

		// Give the spacer a tall rect; it must not raise contentBottom past 80.
		setRect(spacer, { top: 0, height: 9999 });

		expect(getContentBottom({ content, spacer, viewport })).toBe(80);
	});
});

describe('getNewScrollAnchor / getLastScrollAnchor', () => {
	it('finds the first anchor at or after the previous item count', () => {
		const items = createItems([
			{ id: 'a', anchor: true },
			{ id: 'b' },
			{ id: 'c', anchor: true },
			{ id: 'd', anchor: true },
		]);

		// Starting from index 1 skips the anchor at index 0.
		expect(getNewScrollAnchor(items, 1)).toBe(items[2]);
	});

	it('returns null when no anchor exists after the boundary', () => {
		const items = createItems([{ id: 'a', anchor: true }, { id: 'b' }, { id: 'c' }]);

		expect(getNewScrollAnchor(items, 1)).toBeNull();
	});

	it('finds the last anchor scanning from the end', () => {
		const items = createItems([{ id: 'a', anchor: true }, { id: 'b', anchor: true }, { id: 'c' }]);

		expect(getLastScrollAnchor(items)).toBe(items[1]);
	});

	it('returns null when there are no anchors', () => {
		const items = createItems([{ id: 'a' }, { id: 'b' }]);

		expect(getLastScrollAnchor(items)).toBeNull();
	});
});

describe('getUnanchoredScrollAnchor', () => {
	it('returns the first anchor that has not been handled yet', () => {
		const items = createItems([
			{ id: 'a', anchor: true },
			{ id: 'b', anchor: true },
		]);
		const handled = new WeakSet<HTMLElement>();

		expect(getUnanchoredScrollAnchor(items, handled)).toBe(items[0]);

		handled.add(items[0]!);

		expect(getUnanchoredScrollAnchor(items, handled)).toBe(items[1]);
	});

	it('returns null when every anchor has already been handled', () => {
		const items = createItems([{ id: 'a', anchor: true }]);
		const handled = new WeakSet<HTMLElement>([items[0]!]);

		expect(getUnanchoredScrollAnchor(items, handled)).toBeNull();
	});
});

describe('getMessageScrollerScrollable', () => {
	it('cannot scroll toward either edge when viewport or content is missing', () => {
		const scrollable = getMessageScrollerScrollable({
			content: null,
			scrollEdgeThreshold: 8,
			spacer: null,
			viewport: null,
		});

		expect(scrollable).toMatchObject({
			start: false,
			end: false,
		});
	});

	it('treats sub-threshold gaps at both edges as not scrollable', () => {
		stubComputedStyle();
		const { content, spacer, viewport } = createFixture({
			viewportHeight: 200,
			viewportTop: 0,
			// scrollTop 5 <= threshold 8, so it cannot scroll toward the start.
			scrollTop: 5,
			contentPaddingStart: 0,
			contentPaddingEnd: 0,
			// contentBottom 204; 204 - 5 - 200 = -1 <= 8, so it cannot scroll toward the end.
			items: [{ messageId: 'a', top: 199, height: 0 }],
		});

		const scrollable = getMessageScrollerScrollable({
			content,
			scrollEdgeThreshold: 8,
			spacer,
			viewport,
		});

		expect(scrollable).toMatchObject({
			start: false,
			end: false,
		});
	});

	it('can scroll toward both edges past the threshold', () => {
		stubComputedStyle();
		const { content, spacer, viewport } = createFixture({
			viewportHeight: 200,
			viewportTop: 0,
			// scrollTop 100 > threshold 8, so it can scroll toward the start.
			scrollTop: 100,
			contentPaddingStart: 0,
			contentPaddingEnd: 0,
			// contentBottom 1000; 1000 - 100 - 200 = 700 > 8, so it can scroll toward the end.
			items: [{ messageId: 'a', top: 900, height: 100 }],
		});

		const scrollable = getMessageScrollerScrollable({
			content,
			scrollEdgeThreshold: 8,
			spacer,
			viewport,
		});

		expect(scrollable).toMatchObject({
			start: true,
			end: true,
		});
	});
});

describe('getMaxScrollTop', () => {
	it('returns scrollHeight minus clientHeight, clamped at zero', () => {
		const viewport = document.createElement('div');
		Object.defineProperty(viewport, 'scrollHeight', { configurable: true, get: () => 500 });
		Object.defineProperty(viewport, 'clientHeight', { configurable: true, get: () => 200 });

		expect(getMaxScrollTop(viewport)).toBe(300);

		Object.defineProperty(viewport, 'scrollHeight', { configurable: true, get: () => 100 });
		expect(getMaxScrollTop(viewport)).toBe(0);
	});
});

describe('getMessageScrollerItems', () => {
	it('returns content children excluding the spacer', () => {
		const { content, spacer, items } = createFixture({
			viewportHeight: 200,
			items: [
				{ messageId: 'a', top: 0, height: 40 },
				{ messageId: 'b', top: 40, height: 40 },
			],
		});

		expect(getMessageScrollerItems(content, spacer)).toEqual(items);
		expect(getMessageScrollerItems(content, spacer)).not.toContain(spacer);
	});
});

describe('hasMultipleNewScrollAnchors', () => {
	it('is false for a single new anchor and true for two', () => {
		const items = createItems([
			{ id: 'a', anchor: true },
			{ id: 'b' },
			{ id: 'c', anchor: true },
			{ id: 'd', anchor: true },
		]);

		expect(hasMultipleNewScrollAnchors(items, 2)).toBe(true);
		expect(hasMultipleNewScrollAnchors(items, 3)).toBe(false);
		expect(hasMultipleNewScrollAnchors(items, 4)).toBe(false);
	});
});

describe('getElementTop / getElementViewportTop', () => {
	it('converts client rects into content-space and viewport-relative tops', () => {
		const { items, viewport } = createFixture({
			viewportTop: 40,
			viewportHeight: 200,
			scrollTop: 80,
			items: [{ messageId: 'a', top: 60, height: 40 }],
		});

		// client top = viewportTop (40) + relative top (60) = 100
		// content-space top = 100 - 40 + scrollTop 80 = 140
		expect(getElementTop(items[0]!, viewport)).toBe(140);
		expect(getElementViewportTop(items[0]!, viewport)).toBe(60);
	});
});

describe('getTailSpacerHeight', () => {
	it('returns the gap from content bottom to the viewport bottom at scrollTop', () => {
		stubComputedStyle();
		const { content, spacer, viewport } = createFixture({
			viewportHeight: 200,
			scrollTop: 50,
			contentPaddingStart: 0,
			contentPaddingEnd: 0,
			items: [{ messageId: 'a', top: 0, height: 100 }],
		});

		// contentBottom includes scrollTop: rect.bottom (100) + scrollTop (50) = 150.
		// spacer = scrollTop (50) + clientHeight (200) - contentBottom (150) = 100.
		expect(getTailSpacerHeight({ content, scrollTop: 50, spacer, viewport })).toBe(100);
	});
});

describe('getFlexGap / getContentBlockPadding', () => {
	it('reads flex gap from computed style', () => {
		const original = window.getComputedStyle;
		window.getComputedStyle = ((element: Element) => {
			const style = original(element);
			return {
				...style,
				gap: '12px',
				rowGap: 'normal',
			} as CSSStyleDeclaration;
		}) as typeof window.getComputedStyle;
		cleanups.push(() => {
			window.getComputedStyle = original;
		});

		const el = document.createElement('div');
		expect(getFlexGap(el)).toBe(12);
		expect(getFlexGap(null)).toBe(0);
	});

	it('reads content block padding via the spacer parent', () => {
		stubComputedStyle();
		const { spacer } = createFixture({
			viewportHeight: 200,
			contentPaddingStart: 10,
			contentPaddingEnd: 6,
			items: [],
		});

		expect(getContentBlockPadding(spacer)).toEqual({ start: 10, end: 6 });
		expect(getContentBlockPadding(null)).toEqual({ start: 0, end: 0 });
	});
});

describe('getFirstVisibleMessageItem', () => {
	it('returns the first message row intersecting the viewport', () => {
		const { content, spacer, viewport, items } = createFixture({
			viewportTop: 0,
			viewportHeight: 200,
			scrollTop: 0,
			items: [
				{ messageId: 'a', top: -50, height: 40 },
				{ messageId: 'b', top: 20, height: 40 },
				{ messageId: 'c', top: 250, height: 40 },
			],
		});

		// a is fully above (bottom  -10); b intersects; c is below.
		expect(getFirstVisibleMessageItem({ content, spacer, viewport })).toBe(items[1]);
	});

	it('skips rows without a messageId', () => {
		const { content, spacer, viewport, items } = createFixture({
			viewportHeight: 200,
			items: [
				{ top: 0, height: 40 },
				{ messageId: 'b', top: 40, height: 40 },
			],
		});

		expect(getFirstVisibleMessageItem({ content, spacer, viewport })).toBe(items[1]);
	});
});

describe('getMessageScrollerVisibilityState', () => {
	it('returns empty state when content or viewport is missing', () => {
		expect(
			getMessageScrollerVisibilityState({
				content: null,
				scrollMargin: 0,
				scrollPreviousItemPeek: 64,
				spacer: null,
				viewport: null,
				visibleMessageIds: new Set(),
			}),
		).toMatchObject({
			currentAnchorId: null,
			visibleMessageIds: [],
		});
	});

	it('uses layout fallback when IntersectionObserver is unavailable', () => {
		const originalIO = window.IntersectionObserver;
		// Force the layout-tracking path used when IO is missing.
		// @ts-expect-error — intentional deletion for the test
		delete window.IntersectionObserver;
		cleanups.push(() => {
			window.IntersectionObserver = originalIO;
		});

		const { content, spacer, viewport } = createFixture({
			viewportTop: 0,
			viewportHeight: 200,
			scrollTop: 0,
			items: [
				{ messageId: 'a', scrollAnchor: true, top: 0, height: 40 },
				{ messageId: 'b', top: 80, height: 40 },
				{ messageId: 'c', top: 300, height: 40 },
			],
		});

		// lineTop = 0 + 0 + 64 = 64. Anchor a (top 0) has crossed the line.
		// Visible rows are those with bottom > 64 and top < 200 → b only (a bottom 40 <= 64).
		const state = getMessageScrollerVisibilityState({
			content,
			scrollMargin: 0,
			scrollPreviousItemPeek: 64,
			spacer,
			viewport,
			visibleMessageIds: new Set(),
		});

		expect(state.currentAnchorId).toBe('a');
		expect(state.visibleMessageIds).toEqual(['b']);
	});

	it('uses the observer set for non-anchor visibility when IO is available', () => {
		const { content, spacer, viewport } = createFixture({
			viewportTop: 0,
			viewportHeight: 200,
			scrollTop: 0,
			items: [
				{ messageId: 'a', scrollAnchor: true, top: 100, height: 40 },
				{ messageId: 'b', top: 140, height: 40 },
			],
		});

		// lineTop = 64; anchor a top 100 > 64 so not current yet.
		const state = getMessageScrollerVisibilityState({
			content,
			scrollMargin: 0,
			scrollPreviousItemPeek: 64,
			spacer,
			viewport,
			visibleMessageIds: new Set(['b']),
		});

		expect(state.currentAnchorId).toBeNull();
		expect(state.visibleMessageIds).toEqual(['b']);
	});
});
