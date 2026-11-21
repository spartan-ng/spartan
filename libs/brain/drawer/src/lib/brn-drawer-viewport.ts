// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { DOCUMENT } from '@angular/common';
import {
	afterNextRender,
	computed,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	NgZone,
	signal,
	untracked,
} from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { BrnDrawer } from './brn-drawer';
import { BrnDrawerCssVars } from './brn-drawer-css-vars';
import { BrnDrawerProvider } from './brn-drawer-provider';
import { BRN_DRAWER_VIRTUAL_KEYBOARD } from './brn-drawer-virtual-keyboard';
import {
	activeElement,
	clamp,
	closest,
	contains,
	findScrollableTouchTarget,
	getElementAtPoint,
	getTarget,
	isElement,
	type ScrollAxis,
} from './utils/dom';
import { closestSnapPointIndex, getSnapPointSwipeMovement, type ResolvedDrawerSnapPoint } from './utils/snap-points';
import {
	getDisplacement,
	SwipeDismiss,
	type SwipeDirection,
	type SwipeProgressDetails,
	type SwipeReleaseDetails,
} from './utils/swipe-dismiss';

/** Marks an element (and its subtree) that should not start a drawer swipe. */
export const BRN_DRAWER_SWIPE_IGNORE_ATTRIBUTE = 'data-swipe-ignore';
const SWIPE_IGNORE_SELECTOR = `[${BRN_DRAWER_SWIPE_IGNORE_ATTRIBUTE}]`;
/** `data-swipe-ignore="x"` / `"y"` hand touch drags along that axis to the element. */
const AXIS_SWIPE_IGNORE_SELECTORS: Record<ScrollAxis, string> = {
	horizontal: `[${BRN_DRAWER_SWIPE_IGNORE_ATTRIBUTE}="x"]`,
	vertical: `[${BRN_DRAWER_SWIPE_IGNORE_ATTRIBUTE}="y"]`,
};
export const BRN_DRAWER_CONTENT_ATTRIBUTE = 'data-drawer-content';
const DRAWER_CONTENT_SELECTOR = `[${BRN_DRAWER_CONTENT_ATTRIBUTE}]`;
const SWIPE_DISMISS_ATTRIBUTE = 'data-swipe-dismiss';
const SWIPING_ATTRIBUTE = 'data-swiping';
const ENDING_STYLE_ATTRIBUTE = 'data-ending-style';

const MIN_SWIPE_THRESHOLD = 10;
const FAST_SWIPE_VELOCITY = 0.5;
const SNAP_VELOCITY_THRESHOLD = 0.5;
const SNAP_VELOCITY_MULTIPLIER = 300;
const MAX_SNAP_VELOCITY = 4;
const MIN_SWIPE_RELEASE_VELOCITY = 0.2;
const MAX_SWIPE_RELEASE_VELOCITY = 4;
const MIN_SWIPE_RELEASE_DURATION_MS = 80;
const MAX_SWIPE_RELEASE_DURATION_MS = 360;
const MIN_SWIPE_RELEASE_SCALAR = 0.1;
const MAX_SWIPE_RELEASE_SCALAR = 1;
const AXIS_LOCK_SLOP = 6;
const AXIS_LOCK_BIAS = 2;

interface TouchScrollState {
	startX: number;
	startY: number;
	lastX: number;
	lastY: number;
	startedInPopup: boolean;
	scrollTarget: HTMLElement | null;
	hasCrossAxisGestureTarget: boolean;
	allowSwipe: boolean | null;
	preserveNativeCrossAxisScroll: boolean;
	drawerAxisAttributed: boolean;
}

/**
 * A full-screen positioning container for `brnDrawerPopup`. Owns the swipe gesture: swipe to
 * dismiss, swipe between snap points, and scroll/swipe arbitration on touch devices.
 */
@Directive({
	selector: '[brnDrawerViewport],brn-drawer-viewport',
	exportAs: 'brnDrawerViewport',
	host: {
		role: 'presentation',
		'[attr.data-state]': '_drawer.stateComputed()',
		'[attr.data-open]': '_drawer.isOpen() ? "" : null',
		'[attr.data-closed]': '_drawer.isOpen() ? null : ""',
		'[attr.data-starting-style]': '_drawer.transitionStatus() === "starting" ? "" : null',
		'[attr.data-ending-style]': '_drawer.transitionStatus() === "ending" ? "" : null',
		'[attr.data-nested]': '_drawer.nested ? "" : null',
		'[style.pointer-events]': '_drawer.isOpen() ? null : "none"',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointerup)': '_onPointerUp($event)',
		'(pointercancel)': '_onPointerCancel($event)',
		'(click)': '_onClick($event)',
		'(touchstart)': '_onTouchStart($event)',
		'(touchend)': '_onTouchEnd($event)',
		'(touchcancel)': '_onTouchCancel($event)',
	},
})
export class BrnDrawerViewport {
	protected readonly _drawer = inject(BrnDrawer);
	private readonly _dialogRef = inject(BrnDialogRef);
	private readonly _provider = inject(BrnDrawerProvider, { optional: true });
	private readonly _virtualKeyboard = inject(BRN_DRAWER_VIRTUAL_KEYBOARD, { optional: true });
	private readonly _document = inject(DOCUMENT);
	private readonly _element: HTMLElement = inject(ElementRef).nativeElement;

	private readonly _scrollAxis = computed<ScrollAxis>(() => {
		const direction = this._drawer.swipeDirection();
		return direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical';
	});
	private readonly _isVerticalSnap = computed(() => {
		const direction = this._drawer.swipeDirection();
		return direction === 'down' || direction === 'up';
	});
	private readonly _swipeDirections = computed<SwipeDirection[]>(() => {
		const direction = this._drawer.swipeDirection();
		if (this._drawer.hasSnapPoints() && this._isVerticalSnap()) {
			return direction === 'down' ? ['down', 'up'] : ['up', 'down'];
		}
		return [direction];
	});
	private readonly _snapPointRange = computed(() => {
		const resolved = this._drawer.resolvedSnapPoints();
		if ((this._drawer.snapPoints()?.length ?? 0) < 2 || resolved.length < 2 || !this._isVerticalSnap()) return null;

		const offsets = resolved.map((point) => point.offset).sort((a, b) => a - b);
		return { minOffset: offsets[0], range: offsets[1] - offsets[0] };
	});
	private readonly _snapPointProgress = computed(() => {
		const range = this._snapPointRange();
		const offset = this._drawer.activeSnapPointOffset();
		if (!range || offset === null) return null;
		return clamp((offset - range.minOffset) / range.range, 0, 1);
	});

	private readonly _swipeRelease = signal<number | null>(null);
	/** The release transition scalar for the popup's `--drawer-swipe-strength`. */
	public readonly swipeStrength = this._swipeRelease.asReadonly();

	private _pendingSwipeCloseSnapPoint: ReturnType<BrnDrawer['activeSnapPoint']> | undefined = undefined;
	private _swiping = false;
	private _nestedSwipeActive = false;
	private _lastPointerType = '';
	private _ignoreNextTouchStartFromPen = false;
	private _ignoreTouchSwipe = false;
	private _touchScrollState: TouchScrollState | null = null;
	private _outsidePressStarted = false;

	private readonly _swipe = new SwipeDismiss({
		enabled: () => this._drawer.mounted() && this._drawer.nestedOpenDrawerCount() === 0,
		directions: () => this._swipeDirections(),
		element: () => this._drawer.popupElement(),
		ignoreSelectorWhenTouch: false,
		ignoreScrollableAncestors: true,
		movementCssVars: { x: BrnDrawerCssVars.swipeMovementX, y: BrnDrawerCssVars.swipeMovementY },
		onSwipeStart: (event) => this._clearPopupTextSelection(event),
		onSwipingChange: (swiping) => {
			this._swiping = swiping;
			this._dialogRef.backdropElement?.toggleAttribute(SWIPING_ATTRIBUTE, swiping);
			if (!swiping && !this._drawer.parentDrawer) this._finishNestedSwipe();
		},
		swipeThreshold: ({ element, direction }) => getBaseSwipeThreshold(element, direction),
		canStart: (position, { event }) => this._canStart(position, event),
		onProgress: (progress, details) => this._onProgress(progress, details),
		onRelease: (details) => this._onRelease(details),
		onDismiss: () => this._onDismiss(),
	});

	/** Whether the popup is being swiped. */
	public readonly swiping = this._swipe.swiping;

	constructor() {
		const destroyRef = inject(DestroyRef);

		// The viewport positions the popup, so the pane itself must not catch pointer events: the
		// popup opts back in, and empty viewport space falls through to the backdrop (modal) or page.
		this._dialogRef.overlayElement.style.pointerEvents = 'none';

		const backdrop = this._dialogRef.backdropElement;
		if (backdrop) {
			backdrop.style.setProperty(BrnDrawerCssVars.swipeProgress, '0');
			backdrop.style.setProperty(BrnDrawerCssVars.swipeStrength, '1');
			backdrop.style.userSelect = 'none';
			backdrop.style.setProperty('-webkit-user-select', 'none');
			effect(() => (backdrop.style.pointerEvents = this._drawer.isOpen() ? '' : 'none'));
		}

		this._drawer.viewportElement.set(this._element);
		this._drawer.backdropElement.set(backdrop ?? null);
		this._observeViewportSize(destroyRef);
		this._listenToTouchMove();

		// Pointer moves fire on every hover, so they're handled outside Angular to skip a change
		// detection per move. A drag writes styles directly; the signals it sets schedule rendering.
		const onPointerMove = (event: PointerEvent) => this._onPointerMove(event);
		const listeners = new AbortController();
		inject(NgZone).runOutsideAngular(() =>
			this._element.addEventListener('pointermove', onPointerMove, { signal: listeners.signal }),
		);
		destroyRef.onDestroy(() => listeners.abort());

		// Settle on the active snap point whenever it changes outside of a drag.
		effect(() => {
			if (!this._snapPointRange() || this._swipe.swiping()) return;
			// Re-applied when the frontmost height changes: the backdrop and provider receive it.
			this._drawer.frontmostHeight();
			const progress = !this._drawer.isOpen() || this._drawer.nested ? 0 : (this._snapPointProgress() ?? 0);
			untracked(() => this._applySwipeProgress(progress, true, false));
		});

		// A parent drawer follows the swipe of an open nested drawer only.
		effect(() => {
			if (!this._drawer.isOpen()) untracked(() => this._drawer.parentDrawer?.onNestedSwipeProgressChange(0));
		});

		effect(() => {
			if (!this._drawer.isOpen()) return;
			untracked(() => {
				// Skip the reset while a swipe area drives the open: it zeroes the movement vars and would
				// flash the popup fully open for a frame.
				if (!this._drawer.swipeAreaActive) this._swipe.reset();
				this._clearSwipeRelease();
			});
		});

		destroyRef.onDestroy(() => {
			this._drawer.parentDrawer?.onNestedSwipeProgressChange(0);
			this._provider?.visualStateStore.set({ swipeProgress: 0, frontmostHeight: 0 });
			this._dialogRef.backdropElement?.removeAttribute(SWIPING_ATTRIBUTE);
			this._finishNestedSwipe();
			if (this._drawer.viewportElement() === this._element) this._drawer.viewportElement.set(null);
			if (this._drawer.backdropElement() === backdrop) this._drawer.backdropElement.set(null);
		});
	}

	/** The styles the popup renders with outside of imperative drag updates. */
	public getDragStyles(): Record<string, string | null> {
		return this._swipe.getDragStyles();
	}

	public setSwipeDismissed(dismissed: boolean): void {
		this._drawer.popupElement()?.toggleAttribute(SWIPE_DISMISS_ATTRIBUTE, dismissed);
		this._dialogRef.backdropElement?.toggleAttribute(SWIPE_DISMISS_ATTRIBUTE, dismissed);
	}

	protected _onPointerDown(event: PointerEvent): void {
		this._lastPointerType = event.pointerType;
		this._ignoreNextTouchStartFromPen = event.pointerType === 'pen';
		this._outsidePressStarted = this._isOutsidePopup(event);

		if (!this._canInteract()) return;

		const elementAtPoint = getElementAtPoint(this._element.getRootNode(), event.clientX, event.clientY);
		// Pointer drags capture the pointer on press, so they can't wait to see which axis the gesture
		// takes: any `data-swipe-ignore` value ignores them.
		if (closest(elementAtPoint, SWIPE_IGNORE_SELECTOR) || closest(elementAtPoint, DRAWER_CONTENT_SELECTOR)) return;
		if (event.pointerType === 'touch') return;

		this._swipe.handleStart(event);
	}

	private _onPointerMove(event: PointerEvent): void {
		if (event.pointerType === 'touch') return;
		this._swipe.handleMove(event, this._element);
	}

	protected _onPointerUp(event: PointerEvent): void {
		if (this._handlePointerEnd(event)) this._swipe.handleEnd(event);
	}

	protected _onPointerCancel(event: PointerEvent): void {
		if (this._handlePointerEnd(event)) this._swipe.handleEnd(event);
	}

	/** A press on empty viewport space is a press outside the popup (only reachable when the viewport takes pointer events). */
	protected _onClick(event: MouseEvent): void {
		const startedOutside = this._outsidePressStarted;
		this._outsidePressStarted = false;
		if (!startedOutside || !this._isOutsidePopup(event) || event.button !== 0) return;
		this._dialogRef.dismiss(this._drawer.modal() === true ? 'backdrop' : 'outside');
	}

	protected _onTouchStart(event: TouchEvent): void {
		if (this._lastPointerType === 'pen' && this._ignoreNextTouchStartFromPen) {
			this._ignoreNextTouchStartFromPen = false;
			this._resetTouchSwipeState(false);
			return;
		}

		if (!this._canInteract()) {
			this._resetTouchSwipeState(false);
			return;
		}

		const touch = event.touches[0];
		if (!touch) return;

		if (event.composedPath().some((target) => target instanceof HTMLInputElement && target.type === 'range')) {
			this._resetTouchSwipeState(false);
			return;
		}

		const root = this._element;
		const elementAtPoint = getElementAtPoint(root.getRootNode(), touch.clientX, touch.clientY);
		const eventTarget = getTarget(event);
		const target = isElement(eventTarget) ? eventTarget : root;
		if (!contains(root, target)) {
			this._resetTouchSwipeState(true);
			return;
		}

		this._virtualKeyboard?.onTouchStart(event);

		// `x`/`y` hand touch drags along that axis to the element. Any other value ignores the swipe
		// outright; a cross-axis element is arbitrated like a native cross-axis scroller below.
		const scrollAxis = this._scrollAxis();
		const crossScrollAxis: ScrollAxis = scrollAxis === 'vertical' ? 'horizontal' : 'vertical';
		if (closest(elementAtPoint, `${SWIPE_IGNORE_SELECTOR}:not(${AXIS_SWIPE_IGNORE_SELECTORS[crossScrollAxis]})`)) {
			this._resetTouchSwipeState(true);
			return;
		}
		this._ignoreTouchSwipe = false;

		const scrollTarget = findScrollableTouchTarget(target, root, scrollAxis);
		const hasCrossAxisGestureTarget =
			findScrollableTouchTarget(target, root, crossScrollAxis) != null ||
			closest(elementAtPoint, AXIS_SWIPE_IGNORE_SELECTORS[crossScrollAxis]) != null;

		let allowSwipe: boolean | null = null;
		if (scrollTarget) {
			allowSwipe = isAtSwipeStartEdge(scrollTarget, scrollAxis, this._drawer.swipeDirection()) ? null : false;
		}

		this._touchScrollState = {
			startX: touch.clientX,
			startY: touch.clientY,
			lastX: touch.clientX,
			lastY: touch.clientY,
			startedInPopup: contains(this._drawer.popupElement(), elementAtPoint),
			scrollTarget,
			hasCrossAxisGestureTarget,
			allowSwipe,
			preserveNativeCrossAxisScroll: false,
			drawerAxisAttributed: false,
		};

		this._swipe.handleStart(event);
	}

	protected _onTouchEnd(event: TouchEvent): void {
		this._virtualKeyboard?.onTouchEnd(event);
		this._resetTouchTrackingState();
		this._swipe.handleEnd(event);
	}

	protected _onTouchCancel(event: TouchEvent): void {
		this._virtualKeyboard?.onTouchCancel();
		this._resetTouchTrackingState();
		this._swipe.handleEnd(event);
	}

	private _canInteract(): boolean {
		return this._drawer.isOpen() && this._drawer.mounted() && this._drawer.nestedOpenDrawerCount() === 0;
	}

	private _isOutsidePopup(event: Event): boolean {
		const target = getTarget(event);
		return isElement(target) && contains(this._element, target) && !contains(this._drawer.popupElement(), target);
	}

	private _handlePointerEnd(event: PointerEvent): boolean {
		this._lastPointerType = '';
		return event.pointerType !== 'touch';
	}

	private _resetTouchSwipeState(ignoreSwipe: boolean): void {
		this._ignoreTouchSwipe = ignoreSwipe;
		this._touchScrollState = null;
	}

	private _resetTouchTrackingState(): void {
		this._resetTouchSwipeState(false);
		this._lastPointerType = '';
		this._ignoreNextTouchStartFromPen = false;
	}

	private _observeViewportSize(destroyRef: DestroyRef): void {
		const measure = () => {
			this._drawer.viewportHeight.set(this._element.offsetHeight || this._document.documentElement.clientHeight);
			const fontSize = parseFloat(getComputedStyle(this._document.documentElement).fontSize);
			if (Number.isFinite(fontSize)) this._drawer.rootFontSize.set(fontSize);
		};

		// Measured after render, see `brnDrawerPopup`: reading layout earlier would compute styles for the
		// drawer before its classes and `data-starting-style` apply, breaking the enter transition.
		afterNextRender({ read: measure });
		if (typeof ResizeObserver !== 'function') return;
		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(this._element);
		destroyRef.onDestroy(() => resizeObserver.disconnect());
	}

	/**
	 * Claims touch moves for the swipe in a capture-phase, non-passive document listener, so it can
	 * `preventDefault()` native scrolling. Only attached while open, since a non-passive document
	 * listener makes every touch scroll wait on the main thread.
	 */
	private _listenToTouchMove(): void {
		effect((onCleanup) => {
			if (!this._drawer.isOpen() || !this._drawer.mounted()) return;

			const listeners = new AbortController();
			this._document.addEventListener('touchmove', (event) => this._handleNativeTouchMove(event), {
				passive: false,
				capture: true,
				signal: listeners.signal,
			});
			onCleanup(() => listeners.abort());
		});
	}

	private _handleNativeTouchMove(event: TouchEvent): void {
		// The virtual keyboard provider tells a tap from a drag, even when the swipe claims the move.
		this._virtualKeyboard?.onTouchMove(event);
		if (this._ignoreTouchSwipe) return;

		const touchState = this._touchScrollState;
		const touch = event.touches[0];
		if (!touch || !touchState) return;

		this._processTouchMove(event, touchState, touch);
		touchState.lastX = touch.clientX;
		touchState.lastY = touch.clientY;
	}

	private _processTouchMove(event: TouchEvent, touchState: TouchScrollState, touch: Touch): void {
		const root = this._element;
		const scrollAxis = this._scrollAxis();
		const isVertical = scrollAxis === 'vertical';
		const drawerAxisDelta = isVertical ? touch.clientY - touchState.lastY : touch.clientX - touchState.lastX;

		// Avoid blocking pinch zoom or text selection adjustments on iOS Safari.
		if (event.touches.length === 2) return;
		if (shouldIgnoreSwipeForTextSelection(this._document, root) || this._drawer.nestedOpenDrawerCount() > 0) return;
		if (shouldYieldTouchMove(touchState, event, touch, isVertical)) return;

		const scrollTarget = touchState.scrollTarget;
		const doc = this._document;
		if (!scrollTarget || scrollTarget === doc.documentElement || scrollTarget === doc.body) {
			if (event.cancelable) event.preventDefault();
			event.stopPropagation();
			this._swipe.handleMove(event, root);
			return;
		}

		if (getScrollMetrics(scrollTarget, scrollAxis).max <= 0) {
			// The scroll container doesn't overflow on the drawer axis: keep the window from scrolling.
			if (event.cancelable) event.preventDefault();
			event.stopPropagation();
			return;
		}

		if (drawerAxisDelta !== 0) {
			const canSwipeFromEdge = canSwipeFromScrollEdgeOnMove(
				scrollTarget,
				scrollAxis,
				this._drawer.swipeDirection(),
				drawerAxisDelta,
			);

			if (!touchState.allowSwipe) {
				if (event.cancelable && canSwipeFromEdge) {
					touchState.allowSwipe = true;
					event.preventDefault();
				} else {
					touchState.allowSwipe = false;
				}
			} else if (event.cancelable) {
				event.preventDefault();
			}
		}

		if (touchState.allowSwipe === true) {
			event.stopPropagation();
			this._swipe.handleMove(event, root);
		}
	}

	private _clearPopupTextSelection(event: PointerEvent | TouchEvent): void {
		if ('touches' in event || event.pointerType === 'touch') return;

		const popup = this._drawer.popupElement();
		const selection = this._document.getSelection?.();
		if (!selection || selection.isCollapsed) return;

		if (
			!contains(popup, selectionElement(selection.anchorNode)) &&
			!contains(popup, selectionElement(selection.focusNode))
		)
			return;
		selection.removeAllRanges();
	}

	private _canStart(position: { x: number; y: number }, event: PointerEvent | TouchEvent): boolean {
		const popup = this._drawer.popupElement();
		if (!popup) return false;

		const touchLike = 'touches' in event || event.pointerType === 'touch';
		const touchState = touchLike ? this._touchScrollState : null;

		const elementAtPoint = getElementAtPoint(popup.getRootNode(), position.x, position.y);
		// Activation can be deferred until after a touch that started inside has left the popup.
		if (!touchState?.startedInPopup && !contains(popup, elementAtPoint)) return false;
		if (touchLike && shouldIgnoreSwipeForTextSelection(popup.ownerDocument, popup)) return false;

		// Over a cross-axis gesture target, stay pending until the drawer axis wins the gesture.
		if (touchState?.hasCrossAxisGestureTarget && !touchState.drawerAxisAttributed && touchState.allowSwipe !== true) {
			return false;
		}
		return true;
	}

	private _finishNestedSwipe(): void {
		if (!this._nestedSwipeActive) return;
		this._nestedSwipeActive = false;
		this._drawer.parentDrawer?.onNestedSwipingChange(false);
	}

	private _clearSwipeRelease(): void {
		this.setSwipeDismissed(false);
		this._drawer.popupElement()?.removeAttribute(ENDING_STYLE_ATTRIBUTE);
		this._swipeRelease.set(null);
	}

	private _updateNestedSwipeActive(details?: SwipeProgressDetails): void {
		if (this._nestedSwipeActive || !details) return;

		const direction = details.direction ?? this._drawer.swipeDirection();
		if (Math.abs(getDisplacement(direction, details.deltaX, details.deltaY)) < MIN_SWIPE_THRESHOLD) return;

		this._nestedSwipeActive = true;
		this._drawer.parentDrawer?.onNestedSwipingChange(true);
	}

	private _applySwipeProgress(resolvedProgress: number, shouldTrackProgress: boolean, notifyParent: boolean): void {
		const open = this._drawer.isOpen();
		const isActive = open && !this._drawer.nested && shouldTrackProgress;
		const swipeProgress = isActive ? resolvedProgress : 0;
		const nestedSwipeProgress = open && shouldTrackProgress ? resolvedProgress : 0;
		const parent = this._drawer.parentDrawer;
		const frontmostHeight = this._drawer.frontmostHeight();

		if (notifyParent && parent) {
			parent.onNestedSwipeProgressChange(nestedSwipeProgress);
			if (nestedSwipeProgress <= 0) this._finishNestedSwipe();
		}

		this._provider?.visualStateStore.set({
			swipeProgress,
			frontmostHeight: swipeProgress > 0 ? frontmostHeight : 0,
		});

		const backdrop = this._dialogRef.backdropElement;
		if (!backdrop) return;

		const showProgress = isActive && swipeProgress > 0;
		backdrop.style.setProperty(BrnDrawerCssVars.swipeProgress, showProgress ? `${swipeProgress}` : '0');
		if (showProgress && frontmostHeight > 0) {
			backdrop.style.setProperty(BrnDrawerCssVars.height, `${frontmostHeight}px`);
		} else {
			backdrop.style.removeProperty(BrnDrawerCssVars.height);
		}
	}

	private _onProgress(progress: number, details?: SwipeProgressDetails): void {
		const swiping = this._swiping;
		if (swiping) this._updateNestedSwipeActive(details);

		const activeSnapPointOffset = this._drawer.activeSnapPointOffset();
		if (swiping && this._drawer.swipeDirection() === 'down' && this._drawer.hasSnapPoints() && details) {
			const popup = this._drawer.popupElement();
			if (popup) {
				popup.style.removeProperty('transform');
				popup.style.setProperty(
					BrnDrawerCssVars.swipeMovementY,
					`${getSnapPointSwipeMovement(activeSnapPointOffset ?? 0, details.deltaY)}px`,
				);
			}
		}

		let resolvedProgress = progress;
		const range = this._snapPointRange();
		const popupHeight = this._drawer.popupHeight();
		if (range && popupHeight > 0) {
			const baseOffset = activeSnapPointOffset ?? range.minOffset;
			const offsetToProgress = (nextOffset: number) => clamp((nextOffset - range.minOffset) / range.range, 0, 1);

			// Outside a drag the gesture still reports the last drag deltas (after a release, or for a
			// gesture that never started); recomputing from them would re-apply drag progress.
			const snapPointProgress = this._snapPointProgress();
			if (swiping && details && Number.isFinite(details.deltaY)) {
				// Toward dismissal is positive, as in the release: an upward drag closes an `up` drawer.
				const dragDelta = this._drawer.swipeDirection() === 'up' ? -details.deltaY : details.deltaY;
				resolvedProgress = offsetToProgress(clamp(baseOffset + dragDelta, 0, popupHeight));
			} else if (snapPointProgress !== null) {
				resolvedProgress = snapPointProgress;
			}
		}

		// A parent drawer follows an active drag only, so drop it back to zero once the drag ends.
		if (!swiping) {
			this._drawer.parentDrawer?.onNestedSwipeProgressChange(0);
			this._finishNestedSwipe();
		}

		this._applySwipeProgress(resolvedProgress, true, swiping);
	}

	/**
	 * `snapPointOffset` is the offset the popup rested at when the gesture started: closing from a
	 * snap point clears the active snap point before the release is resolved.
	 */
	private _startSwipeRelease(
		popup: HTMLElement,
		direction: SwipeDirection,
		details: SwipeReleaseDetails,
		snapPointOffset = this._drawer.activeSnapPointOffset(),
	): void {
		this._finishNestedSwipe();
		this.setSwipeDismissed(true);
		popup.style.removeProperty('transition');
		const strength = this._resolveSwipeRelease(popup, direction, details, snapPointOffset);
		this._swipeRelease.set(strength);
		popup.style.setProperty(BrnDrawerCssVars.swipeStrength, strengthValue(strength));
	}

	private _resolveSwipeRelease(
		popup: HTMLElement,
		direction: SwipeDirection,
		details: SwipeReleaseDetails,
		snapPointOffset: number | null,
	): number | null {
		const size = getBaseSwipeSize(popup, direction);
		if (size <= 0) return null;

		// The snap point offset shifts the popup along the dismiss direction for both `down` and `up`.
		const snapPointBaseOffset =
			(direction === 'down' || direction === 'up') && this._drawer.hasSnapPoints() ? (snapPointOffset ?? 0) : 0;
		const translation = snapPointBaseOffset + getDisplacement(direction, details.deltaX, details.deltaY);
		const remainingDistance = Math.max(0, size - translation);
		if (remainingDistance <= 0) return null;

		const releaseVelocity = getDisplacement(direction, details.releaseVelocityX, details.releaseVelocityY);
		const directionalVelocity =
			Math.abs(releaseVelocity) > 0
				? releaseVelocity
				: getDisplacement(direction, details.velocityX, details.velocityY);
		if (directionalVelocity <= MIN_SWIPE_RELEASE_VELOCITY) return null;

		const clampedVelocity = clamp(directionalVelocity, MIN_SWIPE_RELEASE_VELOCITY, MAX_SWIPE_RELEASE_VELOCITY);
		const durationMs = clamp(
			remainingDistance / clampedVelocity,
			MIN_SWIPE_RELEASE_DURATION_MS,
			MAX_SWIPE_RELEASE_DURATION_MS,
		);
		const normalizedDuration =
			(durationMs - MIN_SWIPE_RELEASE_DURATION_MS) / (MAX_SWIPE_RELEASE_DURATION_MS - MIN_SWIPE_RELEASE_DURATION_MS);
		return MIN_SWIPE_RELEASE_SCALAR + normalizedDuration * (MAX_SWIPE_RELEASE_SCALAR - MIN_SWIPE_RELEASE_SCALAR);
	}

	private _onRelease(details: SwipeReleaseDetails): boolean | void {
		const popup = this._drawer.popupElement();
		if (!popup) {
			this._clearSwipeRelease();
			return undefined;
		}

		const { direction, deltaX, deltaY, velocityX, velocityY, releaseVelocityY } = details;

		if (!this._drawer.hasSnapPoints()) {
			if (!direction) {
				this._clearSwipeRelease();
				return undefined;
			}

			const directionalDelta = getDisplacement(direction, deltaX, deltaY);
			if (directionalDelta <= 0) {
				this._clearSwipeRelease();
				return false;
			}

			if (getDisplacement(direction, velocityX, velocityY) >= FAST_SWIPE_VELOCITY) {
				this._startSwipeRelease(popup, direction, details);
				return true;
			}

			const shouldClose = directionalDelta > getBaseSwipeThreshold(popup, direction);
			if (shouldClose) {
				this._startSwipeRelease(popup, direction, details);
			} else {
				this._clearSwipeRelease();
			}
			return shouldClose;
		}

		const swipeDirection = this._drawer.swipeDirection();
		if (!this._isVerticalSnap()) {
			this._clearSwipeRelease();
			return undefined;
		}

		const popupHeight = this._drawer.popupHeight();
		if (!popupHeight) {
			this._clearSwipeRelease();
			return false;
		}

		const resolvedSnapPoints = this._drawer.resolvedSnapPoints();
		if (resolvedSnapPoints.length === 0) {
			this._clearSwipeRelease();
			return undefined;
		}

		const dragDelta = swipeDirection === 'down' ? deltaY : -deltaY;
		const dragDirection = Math.sign(dragDelta);
		const releaseDirectionalVelocity = swipeDirection === 'down' ? releaseVelocityY : -releaseVelocityY;
		const fallbackDirectionalVelocity = swipeDirection === 'down' ? velocityY : -velocityY;
		let resolvedVelocity = releaseDirectionalVelocity;
		if (dragDirection !== 0 && Math.abs(dragDelta) >= MIN_SWIPE_THRESHOLD) {
			const velocityDirection = Math.sign(resolvedVelocity);
			// Ignore touch reversals that would otherwise flip the snap decision.
			if (velocityDirection !== 0 && velocityDirection !== dragDirection)
				resolvedVelocity = fallbackDirectionalVelocity;
		}

		const currentOffset = this._drawer.activeSnapPointOffset() ?? 0;
		const dragTargetOffset = clamp(currentOffset + dragDelta, 0, popupHeight);
		const velocityOffset =
			Math.abs(resolvedVelocity) >= SNAP_VELOCITY_THRESHOLD
				? clamp(resolvedVelocity, -MAX_SNAP_VELOCITY, MAX_SNAP_VELOCITY) * SNAP_VELOCITY_MULTIPLIER
				: 0;
		const snapToSequentialPoints = this._drawer.snapToSequentialPoints();
		const targetOffset = snapToSequentialPoints
			? dragTargetOffset
			: clamp(dragTargetOffset + velocityOffset, 0, popupHeight);

		const settleInPlace = () => {
			// Reset nested swipe state now: the trailing progress update is deduped when the drag never
			// produced dismissal progress, so it may not fire.
			this._applySwipeProgress(0, true, true);
			this._clearSwipeRelease();
			return false;
		};

		const settleOnSnapPoint = (snapPoint: ResolvedDrawerSnapPoint) => {
			this._drawer.setActiveSnapPoint(snapPoint.value);
			return settleInPlace();
		};

		const closeFromSnapPoints = (fallbackSnapPoint: ResolvedDrawerSnapPoint) => {
			// An unattributed gesture (e.g. a mostly horizontal flick) may settle but must not dismiss:
			// the gesture drops a directionless dismissal, which would strand the popup visually closed.
			if (!direction) return settleOnSnapPoint(fallbackSnapPoint);
			const snapPointOffset = this._drawer.activeSnapPointOffset();
			this._pendingSwipeCloseSnapPoint = this._drawer.activeSnapPoint();
			this._drawer.setActiveSnapPoint(null);
			this._startSwipeRelease(popup, swipeDirection, details, snapPointOffset);
			return true;
		};

		if (snapToSequentialPoints) {
			const ordered = [...resolvedSnapPoints].sort((first, second) => first.offset - second.offset);
			const orderedOffsets = ordered.map((point) => point.offset);
			const currentIndex = closestSnapPointIndex(orderedOffsets, currentOffset);
			let targetSnapPoint = ordered[closestSnapPointIndex(orderedOffsets, targetOffset)];

			const velocityDirection = Math.sign(resolvedVelocity);
			const shouldAdvance =
				dragDirection !== 0 &&
				velocityDirection !== 0 &&
				velocityDirection === dragDirection &&
				Math.abs(resolvedVelocity) >= SNAP_VELOCITY_THRESHOLD;
			let effectiveTargetOffset = targetOffset;

			if (shouldAdvance) {
				const adjacentIndex = clamp(currentIndex + dragDirection, 0, ordered.length - 1);
				if (adjacentIndex !== currentIndex) {
					const adjacentPoint = ordered[adjacentIndex];
					const shouldForceAdjacent =
						dragDirection > 0 ? targetOffset < adjacentPoint.offset : targetOffset > adjacentPoint.offset;
					if (shouldForceAdjacent) {
						targetSnapPoint = adjacentPoint;
						effectiveTargetOffset = adjacentPoint.offset;
					}
				} else if (dragDirection > 0) {
					return closeFromSnapPoints(targetSnapPoint);
				}
			}

			const closeDistance = Math.abs(effectiveTargetOffset - popupHeight);
			const snapDistance = Math.abs(effectiveTargetOffset - targetSnapPoint.offset);
			return closeDistance < snapDistance ? closeFromSnapPoints(targetSnapPoint) : settleOnSnapPoint(targetSnapPoint);
		}

		const closestSnapPoint =
			resolvedSnapPoints[
				closestSnapPointIndex(
					resolvedSnapPoints.map((point) => point.offset),
					targetOffset,
				)
			];

		if (resolvedVelocity >= FAST_SWIPE_VELOCITY && dragDelta > 0) return closeFromSnapPoints(closestSnapPoint);

		const closeDistance = Math.abs(targetOffset - popupHeight);
		if (closeDistance < Math.abs(targetOffset - closestSnapPoint.offset)) return closeFromSnapPoints(closestSnapPoint);

		return settleOnSnapPoint(closestSnapPoint);
	}

	private _onDismiss(): void {
		this._provider?.visualStateStore.set({ swipeProgress: 0, frontmostHeight: 0 });

		const backdrop = this._dialogRef.backdropElement;
		if (backdrop) {
			backdrop.style.setProperty(BrnDrawerCssVars.swipeProgress, '0');
			backdrop.style.removeProperty(BrnDrawerCssVars.height);
		}

		if (!this._dialogRef.dismiss('swipe')) {
			// Closing was rejected (`disableClose`): restore the snap point and settle back open.
			const pendingSnapPoint = this._pendingSwipeCloseSnapPoint;
			if (pendingSnapPoint !== undefined) this._drawer.setActiveSnapPoint(pendingSnapPoint);
			this._pendingSwipeCloseSnapPoint = undefined;
			this._swipe.reset();
			this._clearSwipeRelease();
			return;
		}

		this._pendingSwipeCloseSnapPoint = undefined;
		this.setSwipeDismissed(true);
		// Apply the ending style synchronously, so the popup doesn't look stuck until change detection
		// renders it. Only after closing: the dialog awaits exit transitions that start once closed.
		this._drawer.popupElement()?.setAttribute(ENDING_STYLE_ATTRIBUTE, '');
	}
}

function strengthValue(strength: number | null): string {
	return typeof strength === 'number' && Number.isFinite(strength) && strength > 0 ? `${strength}` : '1';
}

function selectionElement(node: Node | null): Element | null {
	return isElement(node) ? node : (node?.parentElement ?? null);
}

function getBaseSwipeSize(element: HTMLElement, direction: SwipeDirection): number {
	return direction === 'left' || direction === 'right' ? element.offsetWidth : element.offsetHeight;
}

function getBaseSwipeThreshold(element: HTMLElement, direction: SwipeDirection): number {
	return Math.max(getBaseSwipeSize(element, direction) * 0.5, MIN_SWIPE_THRESHOLD);
}

function shouldIgnoreSwipeForTextSelection(doc: Document, root: HTMLElement): boolean {
	const active = activeElement(doc);
	if (active && contains(root, active) && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
		const { selectionStart, selectionEnd } = active as HTMLInputElement | HTMLTextAreaElement;
		if (selectionStart != null && selectionEnd != null && selectionStart < selectionEnd) return true;
	}

	const selection = doc.getSelection?.();
	if (!selection || selection.isCollapsed) return false;

	return (
		selection.containsNode(root, true) ||
		contains(root, selectionElement(selection.anchorNode)) ||
		contains(root, selectionElement(selection.focusNode))
	);
}

/**
 * Arbitrates a touchmove between the drawer swipe and a cross-axis gesture (a native scroll, or an
 * element marked with the cross-axis `data-swipe-ignore` value). Returns `true` when the move must
 * be left alone: the cross axis already won, or neither axis has passed the slop yet.
 */
function shouldYieldTouchMove(
	touchState: TouchScrollState,
	event: TouchEvent,
	touch: Touch,
	isVertical: boolean,
): boolean {
	if (touchState.preserveNativeCrossAxisScroll) return true;

	// Attribution happens once per gesture.
	if (touchState.drawerAxisAttributed || touchState.allowSwipe === true || !touchState.hasCrossAxisGestureTarget) {
		return false;
	}

	// A non-cancelable touchmove means the browser already committed the gesture to a native scroll.
	if (!event.cancelable) {
		touchState.preserveNativeCrossAxisScroll = true;
		return true;
	}

	const drawerAxisDelta = Math.abs(isVertical ? touch.clientY - touchState.startY : touch.clientX - touchState.startX);
	const crossAxisDelta = Math.abs(isVertical ? touch.clientX - touchState.startX : touch.clientY - touchState.startY);

	if (crossAxisDelta >= AXIS_LOCK_SLOP && crossAxisDelta > drawerAxisDelta + AXIS_LOCK_BIAS) {
		touchState.preserveNativeCrossAxisScroll = true;
		return true;
	}

	if (drawerAxisDelta >= AXIS_LOCK_SLOP) {
		touchState.drawerAxisAttributed = true;
		return false;
	}

	// Not attributable yet. On iOS, `preventDefault()` on the first cancelable touchmove cancels
	// native scrolling for the whole gesture, so leave the event alone.
	return true;
}

function getScrollMetrics(scrollTarget: HTMLElement, axis: ScrollAxis) {
	if (axis === 'vertical') {
		return {
			offset: scrollTarget.scrollTop,
			max: Math.max(0, scrollTarget.scrollHeight - scrollTarget.clientHeight),
		};
	}
	return { offset: scrollTarget.scrollLeft, max: Math.max(0, scrollTarget.scrollWidth - scrollTarget.clientWidth) };
}

function shouldDismissFromStartEdge(direction: SwipeDirection, axis: ScrollAxis): boolean {
	return axis === 'vertical' ? direction === 'down' : direction === 'right';
}

function isAtSwipeStartEdge(scrollTarget: HTMLElement, axis: ScrollAxis, direction: SwipeDirection): boolean {
	const { offset, max } = getScrollMetrics(scrollTarget, axis);
	return shouldDismissFromStartEdge(direction, axis) ? offset <= 0 : offset >= max;
}

function canSwipeFromScrollEdgeOnMove(
	scrollTarget: HTMLElement,
	axis: ScrollAxis,
	direction: SwipeDirection,
	delta: number,
): boolean {
	const movingTowardDismiss = shouldDismissFromStartEdge(direction, axis) ? delta > 0 : delta < 0;
	return movingTowardDismiss && isAtSwipeStartEdge(scrollTarget, axis, direction);
}
