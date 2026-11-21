// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import type { BooleanInput } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
	afterEveryRender,
	afterNextRender,
	booleanAttribute,
	computed,
	DestroyRef,
	Directive,
	effect,
	ElementRef,
	inject,
	Injector,
	input,
	NgZone,
	signal,
	untracked,
} from '@angular/core';
import { BrnDrawer, type BrnDrawerSwipeDirection } from './brn-drawer';
import { BrnDrawerCssVars } from './brn-drawer-css-vars';
import { BrnDrawerProvider } from './brn-drawer-provider';
import { clamp, getElementTransform } from './utils/dom';
import { getDisplacement, SwipeDismiss, type SwipeReleaseDetails } from './utils/swipe-dismiss';

const DEFAULT_SWIPE_OPEN_RATIO = 0.5;
const MIN_SWIPE_START_DISTANCE = 1;
const VELOCITY_THRESHOLD = 0.1;
const FALLBACK_SWIPE_OPEN_THRESHOLD = 40;
const SWIPING_ATTRIBUTE = 'data-swiping';

const OPPOSITE_SWIPE_DIRECTION: Record<BrnDrawerSwipeDirection, BrnDrawerSwipeDirection> = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
};

const isHorizontal = (direction: BrnDrawerSwipeDirection) => direction === 'left' || direction === 'right';

/**
 * An invisible area that opens the drawer with a swipe. Place it inside the drawer, positioned at the
 * screen edge the drawer comes from.
 */
@Directive({
	selector: '[brnDrawerSwipeArea],brn-drawer-swipe-area',
	exportAs: 'brnDrawerSwipeArea',
	host: {
		role: 'presentation',
		'aria-hidden': 'true',
		'[attr.data-open]': '_drawer.isOpen() ? "" : null',
		'[attr.data-closed]': '_drawer.isOpen() ? null : ""',
		'[attr.data-swiping]': '_swipe.swiping() ? "" : null',
		'[attr.data-swipe-direction]': 'resolvedSwipeDirection()',
		'[attr.data-disabled]': 'disabled() ? "" : null',
		'[style.pointer-events]': '_enabled() ? null : "none"',
		'[style.touch-action]':
			'resolvedSwipeDirection() === "left" || resolvedSwipeDirection() === "right" ? "pan-y" : "pan-x"',
		'(pointerdown)': '_onPointerDown($event)',
		'(pointerup)': '_onPointerEvent($event)',
		'(pointercancel)': '_onPointerEvent($event)',
		'(touchstart)': '_swipe.handleStart($event)',
		'(touchend)': '_swipe.handleEnd($event)',
		'(touchcancel)': '_swipe.handleEnd($event)',
	},
})
export class BrnDrawerSwipeArea {
	protected readonly _drawer = inject(BrnDrawer);
	private readonly _provider = inject(BrnDrawerProvider, { optional: true });
	private readonly _document = inject(DOCUMENT);
	private readonly _injector = inject(Injector);
	private readonly _ngZone = inject(NgZone);
	protected readonly _element: HTMLElement = inject(ElementRef).nativeElement;

	/** Whether the swipe area is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	/** The swipe direction that opens the drawer. Defaults to the opposite of the drawer `swipeDirection`. */
	public readonly swipeDirection = input<BrnDrawerSwipeDirection>();

	public readonly resolvedSwipeDirection = computed(
		() => this.swipeDirection() ?? OPPOSITE_SWIPE_DIRECTION[this._drawer.swipeDirection()],
	);
	private readonly _dismissDirection = computed(() => OPPOSITE_SWIPE_DIRECTION[this.resolvedSwipeDirection()]);

	private readonly _swipeActive = signal(false);
	protected readonly _enabled = computed(() => !this.disabled() && (!this._drawer.isOpen() || this._swipeActive()));

	private _swipeStarted = false;
	private _openedBySwipe = false;
	private _dragDelta = { x: 0, y: 0 };
	private _closedOffset: number | null = null;
	private _appliedSwipeStyles = false;
	private _swipePopup: HTMLElement | null = null;
	private _swipeBackdrop: HTMLElement | null = null;
	private _popupTransition: string | null = null;
	private _releaseGuardCleanup: (() => void) | null = null;

	protected readonly _swipe = new SwipeDismiss({
		enabled: () => this._enabled(),
		directions: () => [this.resolvedSwipeDirection()],
		element: () => this._element,
		trackDrag: false,
		movementCssVars: { x: BrnDrawerCssVars.swipeMovementX, y: BrnDrawerCssVars.swipeMovementY },
		onSwipeStart: () => {
			this._releaseGuardCleanup?.();
			this._swipeStarted = true;
			this._openedBySwipe = false;
			this._swipeActive.set(true);
			this._dragDelta = { x: 0, y: 0 };
		},
		onProgress: (_progress, details) => {
			if (!details || !this._swipeStarted) return;

			this._dragDelta = { x: details.deltaX, y: details.deltaY };
			const direction = this.resolvedSwipeDirection();
			if (details.direction !== direction) return;

			const displacement = getDisplacement(direction, details.deltaX, details.deltaY);
			if (!this._openedBySwipe && displacement < MIN_SWIPE_START_DISTANCE) return;

			if (!this._openedBySwipe && !this._drawer.isOpen()) {
				this._openedBySwipe = true;
				// Moves are handled outside Angular: open inside it, so the popup renders.
				this._ngZone.run(() => this._drawer.openFromSwipeArea());
				// The popup renders in the next change detection: measure and position it then, before its
				// first paint. Measuring now would read the popup without its bound styles.
				// A release in the same event (a trailing `buttons: 0` move) ends the gesture before then.
				afterNextRender(
					{ read: () => this._swipeActive() && this._applySwipeMovement() },
					{ injector: this._injector },
				);
				return;
			}

			this._applySwipeMovement();
		},
		onRelease: (details) => this._onRelease(details),
		onCancel: () => this._finishSwipeInteraction(),
	});

	constructor() {
		const destroyRef = inject(DestroyRef);

		// Opening re-renders the popup, which resets its movement vars: re-assert them after every
		// render while the swipe area drives the gesture.
		afterEveryRender({
			write: () => {
				if (this._swipeActive() && this._appliedSwipeStyles) this._applySwipeMovement();
			},
		});

		effect(() => {
			if (this._enabled()) return;
			untracked(() => {
				if (this._swipeActive() && this._drawer.isOpen()) this._enableDismissAfterRelease();
				this._swipe.reset();
				this._dragDelta = { x: 0, y: 0 };
				this._clearSwipeStyles();
				this._resetSwipeInteractionState();
				// A gesture that opened a modal drawer ends here, so lock the page scroll it held back.
				this._drawer.applyDeferredScrollLock();
			});
		});

		// Moves are handled outside Angular to skip a change detection per move.
		const onPointerMove = (event: PointerEvent) => this._onPointerEvent(event);
		let touchStart: { x: number; y: number } | null = null;
		const onTouchStart = (event: TouchEvent) => {
			const touch = event.touches[0];
			touchStart = event.touches.length === 1 && touch ? { x: touch.clientX, y: touch.clientY } : null;
		};
		const onTouchMove = (event: TouchEvent) => {
			this._preventNativeScroll(event, touchStart);
			this._swipe.handleMove(event, this._element);
		};
		const listeners = new AbortController();
		this._ngZone.runOutsideAngular(() => {
			this._element.addEventListener('pointermove', onPointerMove, { signal: listeners.signal });
			this._element.addEventListener('touchstart', onTouchStart, { passive: true, signal: listeners.signal });
			this._element.addEventListener('touchmove', onTouchMove, { signal: listeners.signal });
		});

		destroyRef.onDestroy(() => {
			listeners.abort();
			this._releaseGuardCleanup?.();
			this._clearSwipeStyles();
			this._drawer.applyDeferredScrollLock();
		});
	}

	/**
	 * Not in Base UI. The `touch-action` keeps the browser from scrolling along the swipe axis, but iOS
	 * Safari scrolls the page anyway, which cancels the opening gesture of an `up` or `down` swipe area.
	 * Cancel the native scroll for moves along the swipe axis, as the touch action does elsewhere.
	 */
	private _preventNativeScroll(event: TouchEvent, start: { x: number; y: number } | null): void {
		const touch = event.touches[0];
		if (!start || !touch || event.touches.length !== 1 || !event.cancelable || !this._enabled()) return;

		const dx = Math.abs(touch.clientX - start.x);
		const dy = Math.abs(touch.clientY - start.y);
		if (dx === 0 && dy === 0) return;

		const direction = this.resolvedSwipeDirection();
		const vertical = direction === 'up' || direction === 'down';
		if (vertical ? dy >= dx : dx >= dy) event.preventDefault();
	}

	protected _onPointerDown(event: PointerEvent): void {
		if (event.pointerType === 'touch') return;
		this._swipe.handleStart(event);
		// Keep native text selection and drag gestures from competing with the swipe.
		if (event.cancelable) event.preventDefault();
	}

	protected _onPointerEvent(event: PointerEvent): void {
		if (event.pointerType === 'touch') return;
		if (event.type === 'pointermove') {
			this._swipe.handleMove(event, this._element);
		} else {
			this._swipe.handleEnd(event);
		}
	}

	private _onRelease({ direction, deltaX, deltaY, releaseVelocityX, releaseVelocityY }: SwipeReleaseDetails) {
		const swipeDirection = this.resolvedSwipeDirection();
		const displacement = getDisplacement(swipeDirection, deltaX, deltaY);
		const releaseVelocity = getDisplacement(swipeDirection, releaseVelocityX, releaseVelocityY);
		const shouldOpen =
			direction === swipeDirection &&
			(displacement >= this._swipeOpenThreshold() || releaseVelocity >= VELOCITY_THRESHOLD) &&
			!this.disabled();

		if (shouldOpen) {
			if (!this._drawer.isOpen()) {
				this._openedBySwipe = true;
				this._drawer.openFromSwipeArea();
			}
		} else if (this._openedBySwipe && this._drawer.isOpen()) {
			this._drawer.close();
		}

		this._finishSwipeInteraction();
		return false;
	}

	private _finishSwipeInteraction(): void {
		this._resetSwipeInteractionState();
		this._drawer.applyDeferredScrollLock();
		// Only a gesture that leaves the drawer open has a release click to guard against.
		if (this._drawer.isOpen()) this._enableDismissAfterRelease();
		this._dragDelta = { x: 0, y: 0 };
		this._clearSwipeStyles();
	}

	private _resetSwipeInteractionState(): void {
		this._swipeStarted = false;
		this._openedBySwipe = false;
		this._closedOffset = null;
		this._swipeActive.set(false);
	}

	/**
	 * The pointerup that ends the gesture synthesizes a `click`. When the drag ended outside the
	 * popup, that click would count as an outside press and close the drawer it just opened. Swallow
	 * it, until the next interaction that isn't that click: a deliberate outside press starts with a
	 * `pointerdown`, and a keyboard or assistive tech activation is a click with `detail` 0.
	 */
	private _enableDismissAfterRelease(): void {
		this._releaseGuardCleanup?.();

		const listeners = new AbortController();
		const restore = (event?: Event) => {
			if (event?.type === 'click' && (event as MouseEvent).detail !== 0) {
				// Runs in document capture, ahead of the overlay outside click and backdrop listeners.
				event.stopPropagation();
			}
			this._releaseGuardCleanup = null;
			listeners.abort();
		};

		this._releaseGuardCleanup = restore;
		this._document.addEventListener('pointerdown', restore, { capture: true, signal: listeners.signal });
		this._document.addEventListener('click', restore, { capture: true, signal: listeners.signal });
	}

	private _getPopupSize(popup: HTMLElement): number | null {
		const size = isHorizontal(this._dismissDirection()) ? popup.offsetWidth : popup.offsetHeight;
		return size > 0 ? size : null;
	}

	private _swipeOpenThreshold(): number {
		const popup = this._drawer.popupElement();
		const size = popup ? this._getPopupSize(popup) : null;
		return size === null ? FALLBACK_SWIPE_OPEN_THRESHOLD : size * DEFAULT_SWIPE_OPEN_RATIO;
	}

	private _resolveClosedOffset(popup: HTMLElement): number | null {
		const offset = this._getPopupSize(popup);
		if (offset === null) return null;

		const transform = getElementTransform(popup);
		const transformOffset = isHorizontal(this._dismissDirection()) ? transform.x : transform.y;
		if (Number.isFinite(transformOffset) && Math.abs(transformOffset) > 0.5) {
			return Math.min(offset, Math.abs(transformOffset));
		}
		return offset;
	}

	private _applySwipeMovement(): void {
		const popup = this._drawer.popupElement();
		if (!popup || !this._drawer.isOpen()) return;

		this._closedOffset ??= this._resolveClosedOffset(popup);
		const closedOffset = this._closedOffset;
		if (closedOffset === null) return;

		const dismissDirection = this._dismissDirection();
		const displacement = Math.max(
			0,
			getDisplacement(this.resolvedSwipeDirection(), this._dragDelta.x, this._dragDelta.y),
		);
		const dampedDisplacement =
			displacement > closedOffset ? closedOffset + Math.sqrt(displacement - closedOffset) : displacement;
		const sign = dismissDirection === 'left' || dismissDirection === 'up' ? -1 : 1;
		const movement = (closedOffset - dampedDisplacement) * sign;
		const openProgress = clamp(displacement / closedOffset, 0, 1);
		const frontmostHeight = this._drawer.frontmostHeight();

		popup.style.setProperty(BrnDrawerCssVars.swipeMovementX, `${isHorizontal(dismissDirection) ? movement : 0}px`);
		popup.style.setProperty(BrnDrawerCssVars.swipeMovementY, `${isHorizontal(dismissDirection) ? 0 : movement}px`);
		popup.setAttribute(SWIPING_ATTRIBUTE, '');
		this._swipePopup = popup;
		this._popupTransition ??= popup.style.transition;
		popup.style.transition = 'none';

		const backdrop = this._drawer.backdropElement();
		if (backdrop) {
			backdrop.setAttribute(SWIPING_ATTRIBUTE, '');
			this._swipeBackdrop = backdrop;
			backdrop.style.setProperty(BrnDrawerCssVars.swipeProgress, `${1 - openProgress}`);
			if (openProgress > 0 && frontmostHeight > 0) {
				backdrop.style.setProperty(BrnDrawerCssVars.height, `${frontmostHeight}px`);
			} else {
				backdrop.style.removeProperty(BrnDrawerCssVars.height);
			}
		}

		this._provider?.visualStateStore.set({
			swipeProgress: openProgress,
			frontmostHeight: openProgress > 0 ? frontmostHeight : 0,
		});
		this._appliedSwipeStyles = true;
		this._drawer.swipeAreaActive = true;
	}

	private _clearSwipeStyles(): void {
		const popup = this._swipePopup;
		if (popup) {
			popup.style.removeProperty(BrnDrawerCssVars.swipeMovementX);
			popup.style.removeProperty(BrnDrawerCssVars.swipeMovementY);
			popup.removeAttribute(SWIPING_ATTRIBUTE);
			if (this._popupTransition !== null) popup.style.transition = this._popupTransition;
		}
		this._popupTransition = null;

		const backdrop = this._swipeBackdrop;
		if (backdrop) {
			backdrop.removeAttribute(SWIPING_ATTRIBUTE);
			backdrop.style.setProperty(BrnDrawerCssVars.swipeProgress, '0');
			backdrop.style.removeProperty(BrnDrawerCssVars.height);
		}

		if (this._appliedSwipeStyles) this._provider?.visualStateStore.set({ swipeProgress: 0, frontmostHeight: 0 });
		this._appliedSwipeStyles = false;
		this._swipePopup = null;
		this._swipeBackdrop = null;
		this._drawer.swipeAreaActive = false;
	}
}
