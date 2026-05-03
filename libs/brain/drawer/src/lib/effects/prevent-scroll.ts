// Based on https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/overlays/src/usePreventScroll.ts

import { isIOS } from '../utils/platform';

function chain(...callbacks: (() => void)[]): () => void {
	return () => {
		for (const callback of callbacks) {
			callback();
		}
	};
}

function isScrollable(node: Element | null, checkForOverflow?: boolean): boolean {
	if (!node) {
		return false;
	}

	const style = window.getComputedStyle(node);

	let scrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);

	if (scrollable && checkForOverflow) {
		scrollable = node.scrollHeight !== node.clientHeight || node.scrollWidth !== node.clientWidth;
	}

	return scrollable;
}

function getScrollParent(node: Element, doc: Document, checkForOverflow?: boolean): Element {
	let scrollableNode: Element | null = node;

	if (isScrollable(scrollableNode, checkForOverflow)) {
		scrollableNode = scrollableNode.parentElement;
	}

	while (scrollableNode && !isScrollable(scrollableNode, checkForOverflow)) {
		scrollableNode = scrollableNode.parentElement;
	}

	return scrollableNode || doc.scrollingElement || doc.documentElement;
}

// The number of active preventScroll calls. Used to determine whether to revert back to the original page style/scroll position
let preventScrollCount = 0;
let restore: (() => void) | undefined = undefined;

/**
 * Prevents scrolling on the document body.
 * Returns a cleanup function to restore scrolling.
 *
 * Port of react-modal-sheet's `usePreventScroll` hook as a plain function.
 * Uses platform-specific strategies:
 * - Standard: blocks scroll-causing events + window scroll snap-back.
 * - iOS Safari: touch-event-only locking (avoids `overflow:hidden` drift on focus/blur).
 */
export function preventScroll(doc: Document): () => void {
	preventScrollCount++;
	if (preventScrollCount === 1) {
		if (isIOS()) {
			restore = preventScrollMobileSafari(doc);
		} else {
			restore = preventScrollStandard(doc);
		}
	}

	return () => {
		preventScrollCount--;
		if (preventScrollCount === 0) {
			restore?.();
		}
	};
}

// Instead of overflow:hidden (which breaks position:sticky), we block scroll-causing events
// and use a window scroll listener as a last resort to prevent scrollbar-drag scrolling.
function noop(): void {
	/* nothing to restore */
}

function preventScrollStandard(doc: Document): () => void {
	const win = doc.defaultView;
	if (!win) return noop;

	const scrollX = win.scrollX;
	const scrollY = win.scrollY;

	const onWheel = (e: WheelEvent): void => {
		if (!hasScrollableAncestor((e.composedPath?.()?.[0] as Element) ?? (e.target as Element), doc)) {
			e.preventDefault();
		}
	};

	const onTouchMove = (e: TouchEvent): void => {
		if (!hasScrollableAncestor((e.composedPath?.()?.[0] as Element) ?? (e.target as Element), doc)) {
			e.preventDefault();
		}
	};

	// Last-resort safety net: if anything causes the page to scroll
	// (e.g. keyboard navigation, programmatic scroll), snap back.
	const onScroll = (): void => {
		win.scrollTo(scrollX, scrollY);
	};

	return chain(
		setStyle(doc.body, 'overflowY', 'hidden'),
		addEvent(doc, 'wheel', onWheel, { passive: false, capture: true }),
		addEvent(doc, 'touchmove', onTouchMove, { passive: false, capture: true }),
		addEvent(win, 'scroll', onScroll),
	);
}

// Mobile Safari scroll-locks via touch event interception only.
// overflow:hidden on body causes incremental scroll drift on focus/blur cycles, so we avoid it.
//
// This function handles touch-initiated page scrolling:
// 1. Prevent default on `touchmove` events that are not in a scrollable element.
// 2. Prevent default on `touchmove` at scroll boundaries to stop Safari from scrolling the page.
// 3. Snap window.scrollX/Y back to the position recorded at lock time.
//    Catches Safari's keyboard-induced page scroll: when the user focuses an
//    input inside the drawer, Safari scrolls the underlying page to bring the
//    input above the keyboard, then leaves the page scrolled after the
//    keyboard is dismissed. Drawer-internal scrollers fire their own scroll
//    events on themselves, not on `window`, so this listener doesn't disturb
//    them — only window-level (i.e. Safari-induced) scrolls snap back.
function preventScrollMobileSafari(doc: Document): () => void {
	const win = doc.defaultView;
	let scrollable: Element | undefined = undefined;
	let lastY = 0;
	const lockedScrollX = win?.scrollX ?? 0;
	const lockedScrollY = win?.scrollY ?? 0;

	const onTouchStart = (e: TouchEvent): void => {
		// Use `composedPath` to support shadow DOM.
		const target = e.composedPath()?.[0] as HTMLElement;

		// Store the nearest scrollable parent element from the element that the user touched.
		scrollable = getScrollParent(target, doc, true);

		if (scrollable === doc.documentElement || scrollable === doc.body) {
			return;
		}

		lastY = e.changedTouches[0]?.pageY ?? 0;
	};

	const onTouchMove = (e: TouchEvent): void => {
		// In special situations, `onTouchStart` may be called without `onTouchStart` being called.
		// If `onTouchStart` is not called, `scrollable` is `undefined`. Therefore, such cases are ignored.
		if (scrollable === undefined) {
			return;
		}

		// Prevent scrolling the window.
		if (!scrollable || scrollable === doc.documentElement || scrollable === doc.body) {
			e.preventDefault();
			return;
		}

		// Prevent scrolling up when at the top and scrolling down when at the bottom
		// of a nested scrollable area, otherwise mobile Safari will start scrolling
		// the window instead. Unfortunately, this disables bounce scrolling when at
		// the top but it's the best we can do.
		const y = e.changedTouches[0]?.pageY ?? 0;
		const scrollTop = scrollable.scrollTop;
		const bottom = scrollable.scrollHeight - scrollable.clientHeight;

		if (bottom === 0) {
			return;
		}

		if ((scrollTop <= 0 && y > lastY) || (scrollTop >= bottom && y < lastY)) {
			e.preventDefault();
		}

		lastY = y;
	};

	// Snap-back for non-touch page scroll (keyboard focus, programmatic). Window
	// is the only target whose scroll we want to pin; element scrollers (the
	// drawer body) fire on themselves and aren't observed here.
	const onWindowScroll = (): void => {
		if (!win) return;
		if (win.scrollX === lockedScrollX && win.scrollY === lockedScrollY) return;
		win.scrollTo(lockedScrollX, lockedScrollY);
	};

	// No overflow:hidden on body — it causes incremental scroll drift on each
	// focus/blur cycle in iOS Safari. Touch handlers alone are sufficient to
	// block touch-initiated page scrolling. The only cosmetic artifact is the
	// scrollbar remaining briefly visible when the sheet opens.
	const cleanups: (() => void)[] = [
		// `onTouchStart` only records state — no preventDefault — so passive is safe and faster.
		addEvent(doc, 'touchstart', onTouchStart, {
			passive: true,
			capture: true,
		}),
		addEvent(doc, 'touchmove', onTouchMove, {
			passive: false,
			capture: true,
		}),
	];
	if (win) cleanups.push(addEvent(win, 'scroll', onWindowScroll));
	return chain(...cleanups);
}

// Sets a CSS property on an element, and returns a function to revert it to the previous value.
function setStyle(element: HTMLElement, style: string, value: string): () => void {
	const cur = element.style.getPropertyValue(style);
	element.style.setProperty(style, value);

	return (): void => {
		if (cur) {
			element.style.setProperty(style, cur);
		} else {
			element.style.removeProperty(style);
		}
	};
}

// Adds an event listener to an element, and returns a function to remove it.
function addEvent<K extends keyof GlobalEventHandlersEventMap>(
	target: EventTarget,
	event: K,
	handler: (ev: GlobalEventHandlersEventMap[K]) => void,
	options?: boolean | AddEventListenerOptions,
): () => void {
	target.addEventListener(event, handler as EventListener, options);
	return () => target.removeEventListener(event, handler as EventListener, options);
}

function hasScrollableAncestor(target: Element, doc: Document): boolean {
	const scrollParent = getScrollParent(target, doc, true);
	return scrollParent !== doc.documentElement && scrollParent !== doc.body;
}
