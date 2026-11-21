// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { DOCUMENT } from '@angular/common';
import {
	afterNextRender,
	DestroyRef,
	Directive,
	effect,
	forwardRef,
	inject,
	InjectionToken,
	Injector,
	untracked,
} from '@angular/core';
import { BrnDrawer } from './brn-drawer';
import { BrnDrawerCssVars } from './brn-drawer-css-vars';
import {
	activeElement,
	clamp,
	closest,
	contains,
	findScrollableTouchTarget,
	getElementAtPoint,
	getParentNode,
	getTarget,
	isHTMLElement,
} from './utils/dom';

/** Touch hooks the viewport forwards to `brnDrawerVirtualKeyboardProvider`. */
export interface BrnDrawerVirtualKeyboardHandlers {
	onTouchStart(event: TouchEvent): void;
	/** Driven by the viewport's native `touchmove` listener, so it runs even when a swipe claims the event. */
	onTouchMove(event: TouchEvent): void;
	onTouchEnd(event: TouchEvent): void;
	onTouchCancel(): void;
}

export const BRN_DRAWER_VIRTUAL_KEYBOARD = new InjectionToken<BrnDrawerVirtualKeyboardHandlers>(
	'BrnDrawerVirtualKeyboard',
);

const KEYBOARD_RESIZE_THRESHOLD = 60;
const KEYBOARD_VISIBILITY_MARGIN = 16;
// Cadence of the realign passes after focus moves with the keyboard open: long enough for a smooth
// scroll to show progress between passes, short enough to recover from a scroll WebKit cancels.
const KEYBOARD_REALIGN_INTERVAL = 150;
const KEYBOARD_REALIGN_MAX_PASSES = 4;
// Frames the alignment waits for the scroll destination to stop moving before scrolling anyway.
const KEYBOARD_SETTLE_FRAME_LIMIT = 60;
// Android: frames an alignment scroll may sit still before it is re-issued, and how many times.
const KEYBOARD_SCROLL_STALL_FRAMES = 3;
const KEYBOARD_SCROLL_MAX_REISSUES = 3;
const INPUT_TAP_MOVE_THRESHOLD = 10;
const INPUT_TAP_HIT_SLOP = 16;
const KEYBOARD_INPUT_TYPES = new Set(['email', 'number', 'password', 'search', 'tel', 'text', 'url']);
const TYPEABLE_SELECTOR =
	"input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
const INTERACTIVE_SELECTOR = `button,a[href],[role="button"],select,[tabindex]:not([tabindex="-1"]),${TYPEABLE_SELECTOR}`;

// A scroll container's styles before keyboard slack: inline values to restore, computed baselines.
interface ScrollAdjustment {
	readonly element: HTMLElement;
	readonly overflowAnchor: string;
	readonly paddingBottom: string;
	readonly scrollPaddingBottom: string;
	readonly computedPaddingBottom: number;
	readonly computedScrollPaddingBottom: number;
}

interface KeyboardVisualViewport {
	readonly top: number;
	readonly bottom: number;
	// The browser is still resizing the layout viewport to the visual viewport.
	readonly resizing: boolean;
}

interface KeyboardTouchTarget {
	readonly focusTarget: HTMLElement;
	readonly clickTarget: HTMLElement;
}

// The lift point landed on another interactive element: the tap belongs to it, so the caller must
// not fall back to the touchstart target.
const KEYBOARD_TAP_BLOCKED = Symbol('KeyboardTapBlocked');

const isAndroid = () => typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

/**
 * Keyboard-aware focus and scroll handling for bottom drawers with form fields: keeps the focused
 * field above the virtual keyboard and exposes its height as `--drawer-keyboard-inset` on the
 * viewport. Apply it on the drawer element.
 */
@Directive({
	selector: '[brnDrawerVirtualKeyboardProvider]',
	exportAs: 'brnDrawerVirtualKeyboardProvider',
	providers: [
		{ provide: BRN_DRAWER_VIRTUAL_KEYBOARD, useExisting: forwardRef(() => BrnDrawerVirtualKeyboardProvider) },
	],
})
export class BrnDrawerVirtualKeyboardProvider implements BrnDrawerVirtualKeyboardHandlers {
	private readonly _drawer = inject(BrnDrawer);
	private readonly _document = inject(DOCUMENT);
	private readonly _injector = inject(Injector);

	private _pendingKeyboardFocusMoved = false;
	private _keyboardTouchStart: { x: number; y: number } | null = null;
	private _focusedKeyboardTarget: HTMLElement | null = null;
	private _keyboardScrollAdjustment: ScrollAdjustment | null = null;
	private _programmaticKeyboardFocus = false;
	private _getKeyboardViewport: (() => KeyboardVisualViewport | null) | null = null;
	private _focusFrame = 0;
	private _realignTimeout: ReturnType<typeof setTimeout> | undefined;

	constructor() {
		inject(DestroyRef).onDestroy(() => {
			this._cancelFocusFrame();
			this._clearRealignTimeout();
			this._restoreKeyboardScrollAdjustment();
		});

		effect((onCleanup) => {
			const open = this._drawer.isOpen();
			const mounted = this._drawer.mounted();
			const modal = this._drawer.modal();
			const nestedDrawerOpen = this._drawer.nestedOpenDrawerCount() > 0;
			const rootElement = this._drawer.viewportElement();

			untracked(() => {
				if (!mounted || !open) {
					this._focusedKeyboardTarget = null;
					this._restoreKeyboardScrollAdjustment();
					this._cancelFocusFrame();
					return;
				}
				if (!rootElement) {
					this._restoreKeyboardScrollAdjustment();
					return;
				}
				// Connect after the render: `_connect` reads the page scroll, which forces a layout. Run during
				// change detection, that layout would compute the popup before its `data-starting-style`
				// binding is applied, and the enter transition would have nothing to start from.
				let disconnect: (() => void) | null = null;
				const connectRef = afterNextRender(
					{ read: () => (disconnect = this._connect(rootElement, modal === true, nestedDrawerOpen)) },
					{ injector: this._injector },
				);
				onCleanup(() => {
					connectRef.destroy();
					disconnect?.();
				});
			});
		});
	}

	public onTouchStart(event: TouchEvent): void {
		const touch = event.touches[0];
		this._pendingKeyboardFocusMoved = false;
		this._keyboardTouchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
	}

	public onTouchMove(event: TouchEvent): void {
		const touch = event.touches[0];
		const touchStart = this._keyboardTouchStart;
		if (!touch || !touchStart || this._pendingKeyboardFocusMoved) return;

		// A drag past the threshold is a scroll or swipe, not a tap-to-focus.
		if (
			Math.abs(touch.clientX - touchStart.x) > INPUT_TAP_MOVE_THRESHOLD ||
			Math.abs(touch.clientY - touchStart.y) > INPUT_TAP_MOVE_THRESHOLD
		) {
			this._pendingKeyboardFocusMoved = true;
		}
	}

	public onTouchEnd(event: TouchEvent): void {
		const rootElement = this._drawer.viewportElement();
		if (
			!this._drawer.isOpen() ||
			!this._drawer.mounted() ||
			this._drawer.nestedOpenDrawerCount() > 0 ||
			!rootElement ||
			!this._keyboardTouchStart ||
			this._pendingKeyboardFocusMoved
		) {
			this.onTouchCancel();
			return;
		}

		const touch = event.changedTouches[0] ?? event.touches[0];
		const pointTarget = touch
			? resolveKeyboardTouchTargetFromPoint(rootElement.getRootNode(), touch.clientX, touch.clientY)
			: null;

		// The lift point landed on another interactive element: let its native tap through.
		if (pointTarget === KEYBOARD_TAP_BLOCKED) {
			this.onTouchCancel();
			return;
		}

		const keyboardTarget = touch ? (pointTarget ?? resolveKeyboardTouchTarget(getTarget(event))) : null;
		if (
			!keyboardTarget ||
			!contains(rootElement, keyboardTarget.focusTarget) ||
			!contains(rootElement, keyboardTarget.clickTarget)
		) {
			this.onTouchCancel();
			return;
		}

		const { clickTarget, focusTarget } = keyboardTarget;
		const win = focusTarget.ownerDocument.defaultView ?? window;

		// While pinch-zoomed, keyboard alignment is suspended: leave focus and caret to the browser.
		if (win.visualViewport && win.visualViewport.scale !== 1) {
			this.onTouchCancel();
			return;
		}

		// Already focused with the keyboard up: let the native tap reposition the caret. Android
		// re-shows a dismissed keyboard on a native tap, so always let it through there.
		if (
			activeElement(focusTarget.ownerDocument) === focusTarget &&
			(isAndroid() || !win.visualViewport || this._getKeyboardViewport?.() != null)
		) {
			this.onTouchCancel();
			return;
		}

		// iOS only opens the keyboard when focus happens synchronously in the touch gesture. The flag
		// suppresses the `focusout` of the intermediate blur; the `focusin` that lands clears it.
		event.preventDefault();
		this._programmaticKeyboardFocus = true;
		try {
			focusKeyboardInputWithoutPageScroll(focusTarget);
		} finally {
			this._programmaticKeyboardFocus = false;
		}
		// Preventing the touchend default also suppresses the compatibility `click`: redispatch one.
		dispatchKeyboardClick(clickTarget, touch);
		// Refocus the focused input: brings a natively dismissed keyboard back on iOS, and restores
		// `preventScroll` after a label activation refocused its control without it.
		if (activeElement(focusTarget.ownerDocument) === focusTarget) focusTarget.focus({ preventScroll: true });
		this.onTouchCancel();
	}

	public onTouchCancel(): void {
		this._pendingKeyboardFocusMoved = false;
		this._keyboardTouchStart = null;
	}

	private _requestFocusFrame(callback: () => void): void {
		this._cancelFocusFrame();
		this._focusFrame = requestAnimationFrame(() => {
			this._focusFrame = 0;
			callback();
		});
	}

	private _cancelFocusFrame(): void {
		if (this._focusFrame) cancelAnimationFrame(this._focusFrame);
		this._focusFrame = 0;
	}

	private _startRealignTimeout(callback: () => void): void {
		this._clearRealignTimeout();
		this._realignTimeout = setTimeout(callback, KEYBOARD_REALIGN_INTERVAL);
	}

	private _clearRealignTimeout(): void {
		clearTimeout(this._realignTimeout);
		this._realignTimeout = undefined;
	}

	private _restoreKeyboardScrollAdjustment(): void {
		const adjustment = this._keyboardScrollAdjustment;
		if (!adjustment) return;
		adjustment.element.style.overflowAnchor = adjustment.overflowAnchor;
		adjustment.element.style.paddingBottom = adjustment.paddingBottom;
		adjustment.element.style.scrollPaddingBottom = adjustment.scrollPaddingBottom;
		this._keyboardScrollAdjustment = null;
	}

	private _setKeyboardScrollSlack(element: HTMLElement, slack: number): void {
		const roundedSlack = Math.max(0, Math.ceil(slack));
		let adjustment = this._keyboardScrollAdjustment;

		if (adjustment && !adjustment.element.isConnected) {
			this._restoreKeyboardScrollAdjustment();
			adjustment = null;
		}
		if (roundedSlack === 0) {
			this._restoreKeyboardScrollAdjustment();
			return;
		}
		if (adjustment && adjustment.element !== element) {
			this._restoreKeyboardScrollAdjustment();
			adjustment = null;
		}
		if (!adjustment) {
			const styles = getComputedStyle(element);
			adjustment = {
				element,
				overflowAnchor: element.style.overflowAnchor,
				paddingBottom: element.style.paddingBottom,
				scrollPaddingBottom: element.style.scrollPaddingBottom,
				computedPaddingBottom: Number.parseFloat(styles.paddingBottom) || 0,
				computedScrollPaddingBottom: Number.parseFloat(styles.scrollPaddingBottom) || 0,
			};
			this._keyboardScrollAdjustment = adjustment;
		}

		element.style.overflowAnchor = 'none';
		// At least the visibility margin below the content, so the last field never ends flush
		// against the keyboard.
		element.style.paddingBottom = `${roundedSlack + Math.max(adjustment.computedPaddingBottom, KEYBOARD_VISIBILITY_MARGIN)}px`;
		element.style.scrollPaddingBottom = `${adjustment.computedScrollPaddingBottom + KEYBOARD_VISIBILITY_MARGIN}px`;
	}

	/** Listens to focus and viewport changes while the drawer is open. Returns the teardown. */
	private _connect(rootElement: HTMLElement, modal: boolean, nestedDrawerOpen: boolean): () => void {
		const doc = this._document;
		const win = doc.defaultView ?? window;
		const visualViewport = win.visualViewport;
		const android = isAndroid();

		// Alignment scroll bookkeeping: destination stability, whether a scroll was issued, and the
		// last observed progress, so delayed passes can tell a moving scroll from a stalled one.
		let keyboardScrollElement: HTMLElement | null = null;
		let keyboardScrollDestination = 0;
		let keyboardScrollChecks = 0;
		let keyboardScrollObserved = -1;
		let keyboardScrollStalledFrames = 0;
		let keyboardScrollReissues = 0;
		// Visual viewport height last seen while the keyboard overlapped the layout viewport.
		let keyboardVisualHeight = -1;
		// Android: tallest layout viewport height seen at the current width.
		let tallestLayoutHeight = win.innerHeight;
		let layoutWidth = win.innerWidth;
		let smallViewportProbe: HTMLElement | null = null;

		// Chrome on iOS shrinks `svh` for the keyboard, then the layout viewport down to the visual
		// viewport. Remembering the keyboard's visual height keeps it detected once the overlap is gone.
		const getKeyboardViewport = (): KeyboardVisualViewport | null => {
			if (!visualViewport || visualViewport.scale !== 1) return null;

			const layoutHeight = win.innerHeight;
			const visualHeight = visualViewport.height;

			// A keyboard that resizes the layout viewport shrinks both heights together: detect it as a
			// drop from the tallest layout viewport. Android only, the iOS toolbar changes it as much.
			let layoutShrunk = false;
			if (android) {
				if (win.innerWidth !== layoutWidth) {
					layoutWidth = win.innerWidth;
					tallestLayoutHeight = layoutHeight;
				}
				tallestLayoutHeight = Math.max(tallestLayoutHeight, layoutHeight);
				layoutShrunk = tallestLayoutHeight - layoutHeight > KEYBOARD_RESIZE_THRESHOLD;
			}

			if (layoutHeight - visualHeight > KEYBOARD_RESIZE_THRESHOLD || layoutShrunk) {
				keyboardVisualHeight = visualHeight;
			} else if (Math.abs(visualHeight - keyboardVisualHeight) > KEYBOARD_RESIZE_THRESHOLD) {
				keyboardVisualHeight = -1;
				return null;
			}

			if (!smallViewportProbe) {
				smallViewportProbe = doc.createElement('div');
				smallViewportProbe.style.cssText = 'position:fixed;top:0;height:100svh;visibility:hidden';
				doc.body.appendChild(smallViewportProbe);
			}

			const layoutFollowsKeyboard = smallViewportProbe.offsetHeight - visualHeight <= KEYBOARD_RESIZE_THRESHOLD;
			const top = Math.max(0, visualViewport.offsetTop);
			return {
				top,
				// Fixed content already sits above the keyboard, so an inset would lift it twice.
				bottom: layoutFollowsKeyboard ? layoutHeight : Math.min(layoutHeight, top + visualHeight),
				resizing: layoutFollowsKeyboard && Math.abs(layoutHeight - visualHeight) >= 1,
			};
		};
		this._getKeyboardViewport = getKeyboardViewport;

		const setDrawerKeyboardInset = (inset: number) =>
			rootElement.style.setProperty(BrnDrawerCssVars.keyboardInset, `${Math.max(0, Math.ceil(inset))}px`);

		// WebKit's reveal scroll can move the page even while the scroll lock hides overflow. While the
		// drawer is modal, a window scroll during keyboard interaction is spurious: pin the page.
		const baseScrollX = win.scrollX;
		const baseScrollY = win.scrollY;
		const restoreWindowScroll = (): boolean => {
			if (
				!modal ||
				nestedDrawerOpen ||
				!this._focusedKeyboardTarget ||
				(win.scrollX === baseScrollX && win.scrollY === baseScrollY) ||
				getKeyboardViewport() == null
			) {
				return false;
			}
			// Instant, so a page-wide `scroll-behavior: smooth` doesn't animate it and re-emit `scroll`.
			win.scrollTo({ left: baseScrollX, top: baseScrollY, behavior: 'instant' });
			return true;
		};

		// Native focus moves (the iOS keyboard's previous/next arrows) commit WebKit's reveal scroll
		// before `focusin`. `focusout` on the outgoing field fires first: override the incoming field's
		// geometry there and restore it in `focusin`.
		let restorePreemptedFocus: (() => void) | null = null;
		const consumePreemptedFocus = () => {
			restorePreemptedFocus?.();
			restorePreemptedFocus = null;
		};
		const preemptFocusReveal = (target: HTMLElement, keyboardViewport: KeyboardVisualViewport) => {
			consumePreemptedFocus();
			// Present the field as already centered in the visible band, so both the in-page reveal
			// and the viewport pan are no-ops.
			const rect = target.getBoundingClientRect();
			restorePreemptedFocus = overrideGeometryDuringFocus(
				target,
				(keyboardViewport.top + keyboardViewport.bottom - rect.top - rect.bottom) / 2,
			);
		};

		const alignFocusedKeyboardTarget = (): void => {
			consumePreemptedFocus();

			const target = this._focusedKeyboardTarget;
			if (nestedDrawerOpen || !target || !contains(rootElement, target)) {
				setDrawerKeyboardInset(0);
				this._restoreKeyboardScrollAdjustment();
				return;
			}

			// Undo a reveal scroll on the locked page before measuring.
			restoreWindowScroll();

			const keyboardViewport = getKeyboardViewport();
			if (!keyboardViewport) {
				setDrawerKeyboardInset(0);
				this._restoreKeyboardScrollAdjustment();
				return;
			}

			setDrawerKeyboardInset(Math.max(0, win.innerHeight - keyboardViewport.bottom));

			const scrollTarget = findKeyboardScrollTarget(target, rootElement);
			if (!scrollTarget) {
				this._restoreKeyboardScrollAdjustment();
				return;
			}

			const scrollTargetRect = scrollTarget.getBoundingClientRect();
			const clippedBottom = Math.min(scrollTargetRect.bottom, keyboardViewport.bottom);
			// A sub-pixel overlap is rounding, not the keyboard covering anything.
			const overlap = scrollTargetRect.bottom - keyboardViewport.bottom;
			this._setKeyboardScrollSlack(scrollTarget, overlap > 1 ? overlap : 0);

			const maxScrollTop = Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight);
			if (maxScrollTop <= 0) return;

			const clippedTop = Math.max(scrollTargetRect.top, keyboardViewport.top);
			const visibleTop = clippedTop + KEYBOARD_VISIBILITY_MARGIN;
			const visibleBottom = clippedBottom - KEYBOARD_VISIBILITY_MARGIN;
			if (visibleBottom <= visibleTop) return;

			// Center the field in the visible band, like iOS. Android scroll views reveal a covered field
			// by the minimum distance and leave a visible one in place.
			const targetRect = target.getBoundingClientRect();
			let offset = (targetRect.top + targetRect.bottom - visibleTop - visibleBottom) / 2;
			if (android) {
				const margin = clamp((clippedBottom - clippedTop - targetRect.height) / 2, 0, KEYBOARD_VISIBILITY_MARGIN);
				offset = 0;
				if (targetRect.top < clippedTop) {
					offset = targetRect.top - clippedTop - margin;
				} else if (targetRect.bottom > clippedBottom) {
					// A field taller than the visible band aligns its top.
					offset = Math.min(targetRect.bottom - clippedBottom + margin, targetRect.top - clippedTop - margin);
				}
			}
			const destination = Math.round(clamp(scrollTarget.scrollTop + offset, 0, maxScrollTop));

			if (android && Math.abs(scrollTarget.scrollTop - destination) <= 1) {
				keyboardScrollElement = null;
				return;
			}

			// WebKit restarts a smooth scroll re-issued while the layout viewport resizes.
			const settled =
				keyboardScrollElement === scrollTarget &&
				!keyboardViewport.resizing &&
				Math.abs(keyboardScrollDestination - destination) <= 1;

			if (!settled) {
				// Scroll only once the destination holds across two checks: layout may still be reacting to
				// the focus change, and scrolling toward a mid-transition destination overshoots.
				const checks = keyboardScrollElement === scrollTarget ? keyboardScrollChecks + 1 : 1;
				keyboardScrollElement = scrollTarget;
				keyboardScrollDestination = destination;
				keyboardScrollChecks = checks;
				keyboardScrollObserved = -1;
				keyboardScrollReissues = 0;
				if (checks <= KEYBOARD_SETTLE_FRAME_LIMIT) {
					this._requestFocusFrame(alignFocusedKeyboardTarget);
					return;
				}
			} else if (keyboardScrollObserved >= 0) {
				// A scroll toward this destination is already out: leave it alone while it progresses, and
				// re-issue only when it stalled short (the browser cancels it when its own reveal lands).
				const current = scrollTarget.scrollTop;
				if (!android) {
					if (Math.abs(current - destination) <= 1) return;
					if (current !== keyboardScrollObserved) {
						keyboardScrollObserved = current;
						return;
					}
				} else {
					if (current !== keyboardScrollObserved) {
						keyboardScrollObserved = current;
						keyboardScrollStalledFrames = 0;
						this._requestFocusFrame(alignFocusedKeyboardTarget);
						return;
					}
					keyboardScrollStalledFrames += 1;
					if (keyboardScrollStalledFrames < KEYBOARD_SCROLL_STALL_FRAMES) {
						this._requestFocusFrame(alignFocusedKeyboardTarget);
						return;
					}
					if (keyboardScrollReissues >= KEYBOARD_SCROLL_MAX_REISSUES) return;
					keyboardScrollReissues += 1;
				}
			}

			keyboardScrollElement = scrollTarget;
			keyboardScrollDestination = destination;
			keyboardScrollChecks = 0;
			keyboardScrollObserved = scrollTarget.scrollTop;
			keyboardScrollStalledFrames = 0;
			const reducedMotion = win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
			scrollTarget.scrollTo({ top: destination, behavior: reducedMotion ? 'auto' : 'smooth' });
			if (android) this._requestFocusFrame(alignFocusedKeyboardTarget);
		};

		const scheduleKeyboardFocusAlignment = () => this._requestFocusFrame(alignFocusedKeyboardTarget);

		// With the keyboard already up, focus moves fire no viewport resize, and a single pass measures
		// stale geometry: re-align on an interval until the reveal and layout transitions settle.
		const scheduleDelayedKeyboardRealign = () => {
			let remainingPasses = KEYBOARD_REALIGN_MAX_PASSES;
			const realign = () => {
				alignFocusedKeyboardTarget();
				remainingPasses -= 1;
				if (remainingPasses > 0) this._startRealignTimeout(realign);
			};
			this._startRealignTimeout(realign);
		};

		// Deferred, so a tap's compatibility events still hit-test the field under the finger.
		const releaseFocusedKeyboardTarget = () => {
			this._focusedKeyboardTarget = null;
			keyboardVisualHeight = -1;
			this._clearRealignTimeout();
			scheduleKeyboardFocusAlignment();
		};

		const captureFocusedKeyboardTarget = (eventTarget: EventTarget | null): boolean => {
			if (nestedDrawerOpen) return false;
			const target = resolveKeyboardInputTarget(eventTarget);
			if (!target || !contains(rootElement, target)) return false;
			// A new field starts a fresh alignment.
			if (this._focusedKeyboardTarget !== target) keyboardScrollElement = null;
			this._focusedKeyboardTarget = target;
			return true;
		};

		const handleFocus = (event: FocusEvent) => {
			const target = this._focusedKeyboardTarget;
			// iOS 27 dispatches focus before recording the native focus options: reapply preventScroll.
			if (restorePreemptedFocus && target && target === getTarget(event)) target.focus({ preventScroll: true });
		};

		const handleFocusIn = (event: FocusEvent) => {
			// Focus has landed: any later `focusout` is the consumer's own and must be handled.
			this._programmaticKeyboardFocus = false;
			consumePreemptedFocus();

			if (!captureFocusedKeyboardTarget(getTarget(event))) {
				releaseFocusedKeyboardTarget();
				return;
			}
			if (getKeyboardViewport() != null) scheduleDelayedKeyboardRealign();
			scheduleKeyboardFocusAlignment();
		};

		const handleFocusOut = (event: FocusEvent) => {
			// The blur in `focusKeyboardInputWithoutPageScroll` is followed by a synchronous re-focus.
			if (this._programmaticKeyboardFocus) return;

			if (captureFocusedKeyboardTarget(event.relatedTarget)) {
				const target = this._focusedKeyboardTarget;
				const keyboardViewport = getKeyboardViewport();
				if (target && keyboardViewport) preemptFocusReveal(target, keyboardViewport);
				scheduleKeyboardFocusAlignment();
				return;
			}
			releaseFocusedKeyboardTarget();
		};

		const handleViewportUpdate = () => {
			if (this._focusedKeyboardTarget || captureFocusedKeyboardTarget(activeElement(doc))) {
				scheduleKeyboardFocusAlignment();
			}
		};

		const handleWindowScroll = () => {
			// Re-measure once the page is back at rest: mid-reveal measurements inflate the inset.
			if (restoreWindowScroll()) scheduleKeyboardFocusAlignment();
		};

		// A finger down owns the scroll position: stop the pending alignment passes.
		const cancelKeyboardRealignOnPointerDown = () => {
			if (this._focusedKeyboardTarget) this._cancelFocusFrame();
			this._clearRealignTimeout();
			keyboardScrollElement = null;
		};

		const listeners = new AbortController();
		doc.addEventListener('focus', handleFocus, { capture: true, signal: listeners.signal });
		doc.addEventListener('focusin', handleFocusIn, { capture: true, signal: listeners.signal });
		doc.addEventListener('focusout', handleFocusOut, { capture: true, signal: listeners.signal });
		win.addEventListener('scroll', handleWindowScroll, { signal: listeners.signal });
		doc.addEventListener('pointerdown', cancelKeyboardRealignOnPointerDown, {
			capture: true,
			signal: listeners.signal,
		});
		if (visualViewport) {
			visualViewport.addEventListener('resize', handleViewportUpdate, { signal: listeners.signal });
			visualViewport.addEventListener('scroll', handleViewportUpdate, { signal: listeners.signal });
			// Chrome can keep resizing the layout viewport after visual viewport events stop.
			win.addEventListener('resize', handleViewportUpdate, { signal: listeners.signal });
		}

		if (captureFocusedKeyboardTarget(activeElement(doc))) scheduleKeyboardFocusAlignment();

		return () => {
			listeners.abort();
			consumePreemptedFocus();
			this._focusedKeyboardTarget = null;
			this._restoreKeyboardScrollAdjustment();
			this._cancelFocusFrame();
			this._clearRealignTimeout();
			this._getKeyboardViewport = null;
			(smallViewportProbe as HTMLElement | null)?.remove();
			rootElement.style.removeProperty(BrnDrawerCssVars.keyboardInset);
		};
	}
}

function isKeyboardInputElement(element: HTMLElement): boolean {
	if (element.isContentEditable) return true;
	if (
		element instanceof HTMLTextAreaElement ||
		(element instanceof HTMLInputElement && KEYBOARD_INPUT_TYPES.has(element.type))
	) {
		// Disabled controls can't focus or open the keyboard.
		return !element.matches(':disabled');
	}
	return false;
}

function resolveKeyboardInputTarget(target: EventTarget | null): HTMLElement | null {
	if (!isHTMLElement(target)) return null;
	if (isKeyboardInputElement(target)) return target.isContentEditable ? getContentEditableHost(target) : target;

	const control = (closest(target, 'label') as HTMLLabelElement | null)?.control ?? null;
	return isHTMLElement(control) && isKeyboardInputElement(control) ? control : null;
}

function resolveKeyboardTouchTarget(target: EventTarget | null): KeyboardTouchTarget | null {
	if (!isHTMLElement(target)) return null;
	const focusTarget = resolveKeyboardInputTarget(target);
	return focusTarget ? { focusTarget, clickTarget: target } : null;
}

// Inherited-editable descendants are not focusable: resolve taps on them to the editing host.
function getContentEditableHost(element: HTMLElement): HTMLElement {
	let host = element;
	while (host.parentElement?.isContentEditable) host = host.parentElement;
	return host;
}

function resolveKeyboardTouchTargetFromPoint(
	root: Node,
	clientX: number,
	clientY: number,
): KeyboardTouchTarget | typeof KEYBOARD_TAP_BLOCKED | null {
	const exactTarget = getElementAtPoint(root, clientX, clientY);
	if (isHTMLElement(exactTarget)) {
		const exactKeyboardTarget = resolveKeyboardInputTarget(exactTarget);
		if (exactKeyboardTarget) return { focusTarget: exactKeyboardTarget, clickTarget: exactTarget };
	}

	// Probing nearby points compensates for iOS retargeting taps while the page reacts to the
	// keyboard, but must not steal a tap on another interactive element or label.
	if (closest(exactTarget, INTERACTIVE_SELECTOR) != null || closest(exactTarget, 'label') != null) {
		return KEYBOARD_TAP_BLOCKED;
	}

	for (const [offsetX, offsetY] of [
		[0, INPUT_TAP_HIT_SLOP],
		[0, -INPUT_TAP_HIT_SLOP],
		[INPUT_TAP_HIT_SLOP, 0],
		[-INPUT_TAP_HIT_SLOP, 0],
	]) {
		const keyboardTarget = resolveKeyboardInputTarget(getElementAtPoint(root, clientX + offsetX, clientY + offsetY));
		if (keyboardTarget) return { focusTarget: keyboardTarget, clickTarget: keyboardTarget };
	}
	return null;
}

function dispatchKeyboardClick(target: HTMLElement, touch: Pick<Touch, 'clientX' | 'clientY'>): void {
	const win = target.ownerDocument.defaultView ?? window;
	const ClickEvent = win.PointerEvent ?? win.MouseEvent;
	target.dispatchEvent(
		new ClickEvent('click', {
			bubbles: true,
			cancelable: true,
			clientX: touch.clientX,
			clientY: touch.clientY,
			detail: 1,
			view: win,
		}),
	);
}

function focusKeyboardInputWithoutPageScroll(target: HTMLElement): void {
	const wasFocused = activeElement(target.ownerDocument) === target;
	// iOS Safari can still scroll the page for transformed sheets even with preventScroll: move the
	// input off-screen only for the synchronous focus call.
	const restoreStyles = overrideGeometryDuringFocus(target, -2000);
	try {
		if (wasFocused) target.blur();
		target.focus({ preventScroll: true });
	} finally {
		restoreStyles();
	}
}

// Overrides the painted geometry WebKit samples when an element gains focus. Hidden with opacity, so
// layout is unaffected; the caller restores it synchronously before the next paint.
function overrideGeometryDuringFocus(target: HTMLElement, translateY: number): () => void {
	const previousOpacity = target.style.opacity;
	const previousTransform = target.style.transform;
	const previousTransition = target.style.transition;

	target.style.transition = 'none';
	target.style.opacity = '0';
	target.style.transform = `translateY(${translateY}px)`;

	return () => {
		target.style.opacity = previousOpacity;
		target.style.transform = previousTransform;
		target.style.transition = previousTransition;
	};
}

function findKeyboardScrollTarget(target: HTMLElement, root: HTMLElement): HTMLElement | null {
	// Start at the parent: scrolling the focused field's own content never moves its box. Prefer an
	// already scrollable ancestor, then one that only scrolls once keyboard slack is added.
	const scrollStart = getParentNode(target);
	return (
		findScrollableTouchTarget(scrollStart, root, 'vertical') ??
		findScrollableTouchTarget(scrollStart, root, 'vertical', true)
	);
}
