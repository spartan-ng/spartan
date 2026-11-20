// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { signal } from '@angular/core';
import {
	clamp,
	closest,
	contains,
	findScrollableAncestor,
	findScrollableTouchTarget,
	getElementAtPoint,
	getElementTransform,
	getTarget,
	type ScrollAxis,
} from './dom';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export type SwipeDismissEvent = PointerEvent | TouchEvent;

export interface SwipeProgressDetails {
	deltaX: number;
	deltaY: number;
	direction: SwipeDirection | undefined;
}

export interface SwipeReleaseDetails {
	event: SwipeDismissEvent;
	direction: SwipeDirection | undefined;
	deltaX: number;
	deltaY: number;
	velocityX: number;
	velocityY: number;
	releaseVelocityX: number;
	releaseVelocityY: number;
}

export interface SwipeDismissOptions {
	enabled: () => boolean;
	directions: () => readonly SwipeDirection[];
	element: () => HTMLElement | null;
	movementCssVars: { x: string; y: string };
	/**
	 * The minimum distance (in pixels) the pointer must travel from the initial swipe point before
	 * the gesture is considered a dismiss.
	 * @default 40
	 */
	swipeThreshold?: number | ((details: { element: HTMLElement; direction: SwipeDirection }) => number);
	/** If provided, swiping only begins once this returns true. Evaluated on start and on later moves. */
	canStart?: (
		position: { x: number; y: number },
		details: { event: SwipeDismissEvent; direction: SwipeDirection | undefined },
	) => boolean;
	/** If true, swiping won't start when the gesture begins within a scrollable element. */
	ignoreScrollableAncestors?: boolean;
	/** If false, touch interactions can start swiping on interactive elements ignored for pointers. */
	ignoreSelectorWhenTouch?: boolean;
	/** Whether to write the drag transform and movement vars to the element during a swipe. */
	trackDrag?: boolean;
	onSwipeStart?: (event: SwipeDismissEvent) => void;
	onProgress?: (progress: number, details?: SwipeProgressDetails) => void;
	onCancel?: (event: SwipeDismissEvent) => void;
	onSwipingChange?: (swiping: boolean) => void;
	/** Called when the swipe ends. Returning a boolean overrides the default dismiss decision. */
	onRelease?: (details: SwipeReleaseDetails) => boolean | void;
	onDismiss?: (event: SwipeDismissEvent, details: { direction: SwipeDirection }) => void;
}

const DEFAULT_SWIPE_THRESHOLD = 40;
const REVERSE_CANCEL_THRESHOLD = 10;
const MIN_VELOCITY_DURATION_MS = 50;
// Under one frame at 240 Hz, so it only damps near-simultaneous samples.
const MIN_RELEASE_VELOCITY_DURATION_MS = 4;
const MAX_RELEASE_VELOCITY_AGE_MS = 80;
const MIN_VELOCITY_SAMPLE_DISTANCE = 1;
const DEFAULT_IGNORE_SELECTOR = 'button,a,input,select,textarea,label,[role="button"]';

export function getDisplacement(direction: SwipeDirection, deltaX: number, deltaY: number): number {
	switch (direction) {
		case 'up':
			return -deltaY;
		case 'down':
			return deltaY;
		case 'left':
			return -deltaX;
		case 'right':
			return deltaX;
		default:
			return 0;
	}
}

export function applyDirectionalDamping(deltaX: number, deltaY: number, directions: readonly SwipeDirection[]) {
	const dampAxis = (delta: number, negative: SwipeDirection, positive: SwipeDirection) =>
		(delta < 0 && !directions.includes(negative)) || (delta > 0 && !directions.includes(positive))
			? Math.sign(delta) * Math.abs(delta) ** 0.5
			: delta;

	return { x: dampAxis(deltaX, 'left', 'right'), y: dampAxis(deltaY, 'up', 'down') };
}

export function updateSwipeCancelBaseline(
	baseline: { x: number; y: number },
	position: { x: number; y: number },
	movement: { x: number; y: number },
) {
	const clampAxis = (pos: number, base: number, move: number) =>
		(move < 0 && pos > base) || (move > 0 && pos < base) ? pos : base;

	return {
		x: clampAxis(position.x, baseline.x, movement.x),
		y: clampAxis(position.y, baseline.y, movement.y),
	};
}

export function shouldCancelReverseSwipe(
	directions: readonly SwipeDirection[],
	maxDisplacement: number,
	currentDisplacement: number,
): boolean {
	return (
		!(directions.includes('left') && directions.includes('right')) &&
		!(directions.includes('up') && directions.includes('down')) &&
		maxDisplacement - currentDisplacement >= REVERSE_CANCEL_THRESHOLD
	);
}

export function getDismissDirection(
	directions: readonly SwipeDirection[],
	deltaX: number,
	deltaY: number,
	threshold: number,
): SwipeDirection | undefined {
	return directions.find((direction) => getDisplacement(direction, deltaX, deltaY) > threshold);
}

function getValidTimeStamp(timeStamp: number): number | null {
	return Number.isFinite(timeStamp) && timeStamp > 0 ? timeStamp : null;
}

function getDragTransform(dragOffset: { x: number; y: number }, scale: number): string {
	return `translate3d(${dragOffset.x}px,${dragOffset.y}px,0) scale(${scale})`;
}

function hasPrimaryMouseButton(buttons: number): boolean {
	return buttons % 2 === 1;
}

function isTouchEvent(event: SwipeDismissEvent): event is TouchEvent {
	return 'touches' in event;
}

function isTouchLikeEvent(event: SwipeDismissEvent): boolean {
	return isTouchEvent(event) || event.pointerType === 'touch';
}

function getPrimaryPointerPosition(event: SwipeDismissEvent): { x: number; y: number } | null {
	if (isTouchEvent(event)) {
		const touch = event.touches[0];
		return touch ? { x: touch.clientX, y: touch.clientY } : null;
	}
	return { x: event.clientX, y: event.clientY };
}

function safelyChangePointerCapture(
	element: HTMLElement,
	pointerId: number,
	method: 'setPointerCapture' | 'releasePointerCapture',
): void {
	if (typeof element[method] !== 'function') return;
	try {
		element[method](pointerId);
	} catch (error) {
		if (error && typeof error === 'object' && 'name' in error && error.name === 'NotFoundError') return;
		throw error;
	}
}

/**
 * Swipe-to-dismiss gesture tracking for a single element. Framework-agnostic port of Base UI's
 * `useSwipeDismiss`: the owner forwards pointer and touch events, and reads `swiping`,
 * `swipeDirection` and `dragDismissed` as signals.
 */
export class SwipeDismiss {
	private readonly _swiping = signal(false);
	public readonly swiping = this._swiping.asReadonly();
	private readonly _swipeDirection = signal<SwipeDirection | undefined>(undefined);
	public readonly swipeDirection = this._swipeDirection.asReadonly();
	private readonly _dragDismissed = signal(false);
	public readonly dragDismissed = this._dragDismissed.asReadonly();

	private _dragStartPos = { x: 0, y: 0 };
	private _dragOffset = { x: 0, y: 0 };
	private _lastMovePos: { x: number; y: number } | null = null;
	private _initialTransform = { x: 0, y: 0, scale: 1 };
	private _intendedSwipeDirection: SwipeDirection | undefined;
	private _maxSwipeDisplacement = 0;
	private _cancelledSwipe = false;
	private _swipeCancelBaseline = { x: 0, y: 0 };
	private _isFirstPointerMove = false;
	private _pendingSwipe = false;
	private _pendingSwipeStartPos: { x: number; y: number } | null = null;
	private _swipeFromScrollable = false;
	private _sawPrimaryButtonsOnMove = false;
	private _elementSize = { width: 0, height: 0 };
	private _swipeProgress = 0;
	private _swipeThreshold: number;
	private _swipeThresholdFunction: ((details: { element: HTMLElement; direction: SwipeDirection }) => number) | null =
		null;
	private _swipeStartTime: number | null = null;
	private _lastDragSample: { x: number; y: number; time: number } | null = null;
	private _hasStationarySample = false;
	private _lastDragVelocity = { x: 0, y: 0 };
	private _lastProgressDetails: SwipeProgressDetails | null = null;
	private _isSwiping = false;
	private _dragStyleSnapshot: [string, string] | null = null;

	constructor(private readonly _options: SwipeDismissOptions) {
		this._swipeThreshold = this._defaultSwipeThreshold;
	}

	private get _directions(): readonly SwipeDirection[] {
		return this._options.directions();
	}

	private get _primaryDirection(): SwipeDirection | undefined {
		const directions = this._directions;
		return directions.length === 1 ? directions[0] : undefined;
	}

	private get _hasHorizontal(): boolean {
		return this._directions.includes('left') || this._directions.includes('right');
	}

	private get _hasVertical(): boolean {
		return this._directions.includes('up') || this._directions.includes('down');
	}

	// Consumers only pass directions on a single axis.
	private get _scrollAxis(): ScrollAxis {
		return this._hasHorizontal ? 'horizontal' : 'vertical';
	}

	private get _defaultSwipeThreshold(): number {
		const threshold = this._options.swipeThreshold;
		return Math.max(0, typeof threshold === 'number' ? threshold : DEFAULT_SWIPE_THRESHOLD);
	}

	private get _trackDrag(): boolean {
		return this._options.trackDrag ?? true;
	}

	/** The styles the element should render with outside of the imperative drag updates. */
	public getDragStyles(): Record<string, string | null> {
		const { x: movementX, y: movementY } = this._options.movementCssVars;
		const dragOffset = this._dragOffset;
		const deltaX = dragOffset.x - this._initialTransform.x;
		const deltaY = dragOffset.y - this._initialTransform.y;
		const swiping = this._isSwiping;

		if (!swiping && deltaX === 0 && deltaY === 0 && !this._dragDismissed()) {
			return { [movementX]: '0px', [movementY]: '0px' };
		}

		return {
			transition: swiping ? 'none' : null,
			// While swiping, freeze the element at its current visual transform so it doesn't snap.
			transform: swiping ? getDragTransform(dragOffset, this._initialTransform.scale) : null,
			[movementX]: `${deltaX}px`,
			[movementY]: `${deltaY}px`,
		};
	}

	public reset(): void {
		this._swipeDirection.set(undefined);
		this._setSwiping(false);
		this._dragDismissed.set(false);
		this._updateSwipeProgress(0);

		this._swipeThreshold = this._defaultSwipeThreshold;
		this._swipeThresholdFunction = null;
		this._dragStartPos = { x: 0, y: 0 };
		this._dragOffset = { x: 0, y: 0 };
		this._initialTransform = { x: 0, y: 0, scale: 1 };
		this._intendedSwipeDirection = undefined;
		this._maxSwipeDisplacement = 0;
		this._cancelledSwipe = false;
		this._swipeCancelBaseline = { x: 0, y: 0 };
		this._isFirstPointerMove = false;
		this._lastMovePos = null;
		this._pendingSwipe = false;
		this._pendingSwipeStartPos = null;
		this._swipeFromScrollable = false;
		this._sawPrimaryButtonsOnMove = false;
		this._elementSize = { width: 0, height: 0 };
		this._swipeStartTime = null;
		this._lastDragSample = null;
		this._hasStationarySample = false;
		this._lastDragVelocity = { x: 0, y: 0 };
		this._lastProgressDetails = null;
		this._syncDragStyles(false);
	}

	public handleStart(event: SwipeDismissEvent): void {
		if (!this._options.enabled() || event.defaultPrevented) return;
		if (!isTouchEvent(event) && event.button !== 0) return;

		const startPos = getPrimaryPointerPosition(event);
		if (!startPos) return;

		this._pendingSwipe = true;
		this._pendingSwipeStartPos = startPos;
		this._swipeFromScrollable = false;
		this._sawPrimaryButtonsOnMove = !isTouchEvent(event);

		const canStart = this._options.canStart;
		if (canStart && !canStart(startPos, { event, direction: this._primaryDirection })) return;

		if (this._startSwipeAtPosition(event, startPos)) this._clearPendingSwipeStartState();
	}

	public handleMove(event: SwipeDismissEvent, currentTarget: HTMLElement): void {
		const currentPos = getPrimaryPointerPosition(event);
		if (!currentPos) return;

		let endAfterMove = false;

		if (!isTouchEvent(event)) {
			const hasPrimaryButton = hasPrimaryMouseButton(event.buttons);
			if (hasPrimaryButton) this._sawPrimaryButtonsOnMove = true;

			// Cancel the swipe if a non-primary button takes over the interaction (e.g. a right-click).
			if (event.buttons !== 0 && !hasPrimaryButton) {
				this._cancelSwipeInteraction(event);
				return;
			}

			// A `buttons: 0` pointermove means the primary button was already released, so the gesture
			// is over even if no pointerup reached us (fast trackpad flicks). Treat it as the release.
			if (event.buttons === 0 && this._sawPrimaryButtonsOnMove) {
				if (!this._isSwiping) {
					this.handleEnd(event);
					return;
				}
				// This move can itself carry the threshold-crossing displacement and peak velocity, so
				// let it update the drag first, then commit the release.
				endAfterMove = true;
			}
		}

		if (!this._isSwiping && this._pendingSwipe) {
			if (!isTouchLikeEvent(event) && event.defaultPrevented) {
				this._resetPendingSwipeState();
				return;
			}

			const canStart = this._options.canStart;
			if (!canStart || canStart(currentPos, { event, direction: this._primaryDirection })) {
				const pendingStartPos = this._pendingSwipeStartPos;
				let ignoreScrollableOnStart = false;
				const element = this._options.element();
				if (isTouchLikeEvent(event) && pendingStartPos && element) {
					const target = this._getTargetAtPoint(currentPos, event);
					const body = element.ownerDocument.body;
					const scrollTarget = body ? this._findGestureScrollableTouchTarget(target, body) : null;

					if (scrollTarget && (contains(element, scrollTarget) || contains(scrollTarget, element))) {
						const canSwipeFromEdge = this._canSwipeFromScrollEdgeOnPendingMove(
							scrollTarget,
							currentPos.x - pendingStartPos.x,
							currentPos.y - pendingStartPos.y,
						);
						if (canSwipeFromEdge === false) return;
						if (canSwipeFromEdge === true) ignoreScrollableOnStart = true;
					}
				}

				const started = this._startSwipeAtPosition(event, currentPos, {
					ignoreScrollableTarget: ignoreScrollableOnStart,
					ignoreScrollableAncestors: ignoreScrollableOnStart,
				});
				if (started) {
					this._clearPendingSwipeStartState();
					if (pendingStartPos && ignoreScrollableOnStart) {
						// Keep the displacement between touchstart and the activating move so quick flicks
						// from a scroll edge can dismiss.
						this._dragStartPos = pendingStartPos;
						this._swipeCancelBaseline = pendingStartPos;
						this._lastMovePos = pendingStartPos;
						this._isFirstPointerMove = false;
					} else {
						this._swipeFromScrollable = false;
					}
				}
			}
		}

		const previousPos = this._lastMovePos;
		const movement =
			previousPos === null ? { x: 0, y: 0 } : { x: currentPos.x - previousPos.x, y: currentPos.y - previousPos.y };

		this._lastMovePos = currentPos;
		this._handleMoveCore(event, currentTarget, currentPos, movement);

		if (endAfterMove) this.handleEnd(event);
	}

	public handleEnd(event: SwipeDismissEvent): void {
		if (!this._options.enabled()) return;

		const dragOffset = this._dragOffset;
		const initialTransform = this._initialTransform;
		const deltaX = dragOffset.x - initialTransform.x;
		const deltaY = dragOffset.y - initialTransform.y;
		const progressDetails: SwipeProgressDetails = { deltaX, deltaY, direction: this._intendedSwipeDirection };

		if (!this._isSwiping) {
			this._resetPendingSwipeState();
			this._updateSwipeProgress(0, progressDetails);
			return;
		}

		this._setSwiping(false);
		this._resetPendingSwipeState();
		this._sawPrimaryButtonsOnMove = false;

		const element = this._options.element();
		if (element && !isTouchEvent(event)) safelyChangePointerCapture(element, event.pointerId, 'releasePointerCapture');

		const startTime = this._swipeStartTime;
		const endTime = getValidTimeStamp(event.timeStamp);
		const durationMs = startTime !== null && endTime !== null && endTime > startTime ? endTime - startTime : 0;
		const velocityDurationMs = durationMs > 0 ? Math.max(durationMs, MIN_VELOCITY_DURATION_MS) : 0;
		const velocityX = velocityDurationMs > 0 ? deltaX / velocityDurationMs : 0;
		const velocityY = velocityDurationMs > 0 ? deltaY / velocityDurationMs : 0;
		let releaseVelocityX = this._lastDragVelocity.x;
		let releaseVelocityY = this._lastDragVelocity.y;
		const lastSample = this._lastDragSample;
		if (lastSample && endTime !== null && endTime >= lastSample.time) {
			const ageMs = endTime - lastSample.time;
			if (ageMs <= MAX_RELEASE_VELOCITY_AGE_MS) {
				const sampleDurationMs = Math.max(ageMs, MIN_RELEASE_VELOCITY_DURATION_MS);
				const deltaFromLastSampleX = dragOffset.x - lastSample.x;
				const deltaFromLastSampleY = dragOffset.y - lastSample.y;
				if (Math.abs(deltaFromLastSampleX) >= MIN_VELOCITY_SAMPLE_DISTANCE) {
					releaseVelocityX = deltaFromLastSampleX / sampleDurationMs;
				}
				if (Math.abs(deltaFromLastSampleY) >= MIN_VELOCITY_SAMPLE_DISTANCE) {
					releaseVelocityY = deltaFromLastSampleY / sampleDurationMs;
				}
			} else {
				releaseVelocityX = 0;
				releaseVelocityY = 0;
			}
		}

		const releaseDecision = this._options.onRelease?.({
			event,
			direction: this._intendedSwipeDirection,
			deltaX,
			deltaY,
			velocityX,
			velocityY,
			releaseVelocityX,
			releaseVelocityY,
		});

		let shouldClose = false;
		let dismissDirection: SwipeDirection | undefined;

		if (typeof releaseDecision === 'boolean') {
			shouldClose = releaseDecision;
			dismissDirection = this._intendedSwipeDirection ?? this._primaryDirection;
		} else if (!this._cancelledSwipe) {
			dismissDirection = getDismissDirection(this._directions, deltaX, deltaY, this._swipeThreshold);
			shouldClose = dismissDirection !== undefined;
		}

		if (shouldClose && dismissDirection) {
			this._swipeDirection.set(dismissDirection);
			this._dragDismissed.set(true);
			this._syncDragStyles(false);
			this._options.onDismiss?.(event, { direction: dismissDirection });
		} else {
			this._dragOffset = { x: initialTransform.x, y: initialTransform.y };
			this._swipeDirection.set(undefined);
			this._syncDragStyles(false);
			this._updateSwipeProgress(0, progressDetails);
		}
	}

	/** Cancels a pointer-driven swipe, e.g. when a non-primary button takes over. */
	private _cancelSwipeInteraction(event: PointerEvent): void {
		this._resetPendingSwipeState();
		if (!this._isSwiping) return;

		this._setSwiping(false);
		this._dragOffset = { x: this._initialTransform.x, y: this._initialTransform.y };
		this._swipeDirection.set(undefined);
		this._sawPrimaryButtonsOnMove = false;
		this._syncDragStyles(false);

		const element = this._options.element();
		if (element) safelyChangePointerCapture(element, event.pointerId, 'releasePointerCapture');

		this._updateSwipeProgress(0, { deltaX: 0, deltaY: 0, direction: undefined });
		this._options.onCancel?.(event);
	}

	private _setSwiping(swiping: boolean): void {
		if (this._isSwiping === swiping) return;
		this._isSwiping = swiping;
		this._swiping.set(swiping);
		this._options.onSwipingChange?.(swiping);
	}

	private _resolveSwipeThreshold(direction: SwipeDirection | undefined): void {
		const element = this._options.element();
		const thresholdFunction = this._swipeThresholdFunction;
		if (!direction || !element || !thresholdFunction) return;
		this._swipeThreshold = Math.max(0, thresholdFunction({ element, direction }));
	}

	private _updateSwipeProgress(progress: number, details?: SwipeProgressDetails): void {
		const nextProgress = Number.isFinite(progress) ? clamp(progress, 0, 1) : 0;
		const progressChanged = nextProgress !== this._swipeProgress;
		let detailsChanged = false;

		if (details) {
			const last = this._lastProgressDetails;
			detailsChanged =
				!last ||
				last.deltaX !== details.deltaX ||
				last.deltaY !== details.deltaY ||
				last.direction !== details.direction;
		}

		if (!progressChanged && !detailsChanged) return;

		this._swipeProgress = nextProgress;
		if (details) {
			this._lastProgressDetails = details;
		} else if (progressChanged) {
			this._lastProgressDetails = null;
		}
		this._options.onProgress?.(nextProgress, details);
	}

	private _syncDragStyles(swiping: boolean): void {
		const element = this._options.element();
		if (!this._trackDrag || !element) {
			if (!swiping) this._dragStyleSnapshot = null;
			return;
		}

		const style = element.style;
		if (swiping) {
			this._dragStyleSnapshot ??= [style.transition, style.transform];
			style.transition = 'none';
		} else if (this._dragStyleSnapshot) {
			[style.transition, style.transform] = this._dragStyleSnapshot;
			this._dragStyleSnapshot = null;
		}

		const dragOffset = this._dragOffset;
		const initialTransform = this._initialTransform;
		if (swiping) style.transform = getDragTransform(dragOffset, initialTransform.scale);

		style.setProperty(this._options.movementCssVars.x, `${dragOffset.x - initialTransform.x}px`);
		style.setProperty(this._options.movementCssVars.y, `${dragOffset.y - initialTransform.y}px`);
	}

	private _recordDragSample(offset: { x: number; y: number }, timeStamp: number | null): void {
		if (timeStamp === null) return;

		const lastSample = this._lastDragSample;
		if (lastSample && timeStamp > lastSample.time) {
			// Some Android devices emit one effectively stationary move right before release. Keep the
			// last moving sample; repeated stationary moves still clear the velocity.
			const stationary =
				Math.abs(offset.x - lastSample.x) < MIN_VELOCITY_SAMPLE_DISTANCE &&
				Math.abs(offset.y - lastSample.y) < MIN_VELOCITY_SAMPLE_DISTANCE;
			const skipSample = stationary && !this._hasStationarySample;
			this._hasStationarySample = stationary;
			if (skipSample) return;

			const durationMs = Math.max(timeStamp - lastSample.time, MIN_RELEASE_VELOCITY_DURATION_MS);
			this._lastDragVelocity = {
				x: (offset.x - lastSample.x) / durationMs,
				y: (offset.y - lastSample.y) / durationMs,
			};
		}

		this._lastDragSample = { x: offset.x, y: offset.y, time: timeStamp };
	}

	private _getTargetAtPoint(position: { x: number; y: number }, event: Event): Element | null {
		const root = this._options.element()?.getRootNode();
		return getElementAtPoint(root, position.x, position.y) ?? (getTarget(event) as Element | null);
	}

	private _findGestureScrollableTouchTarget(target: EventTarget | null, root: HTMLElement): HTMLElement | null {
		// The swiped element is positioned relative to the viewport, so the page scroller must not gate
		// the gesture (e.g. `html, body { height: 100%; overflow: auto }`).
		const scrollTarget = findScrollableTouchTarget(target, root, this._scrollAxis);
		const doc = scrollTarget?.ownerDocument;
		return scrollTarget === doc?.body || scrollTarget === doc?.documentElement ? null : scrollTarget;
	}

	private _startSwipeAtPosition(
		event: SwipeDismissEvent,
		position: { x: number; y: number },
		startOptions?: { ignoreScrollableTarget?: boolean; ignoreScrollableAncestors?: boolean },
	): boolean {
		this._swipeFromScrollable = false;
		const touchLike = isTouchLikeEvent(event);
		const target = this._getTargetAtPoint(position, event);
		const element = this._options.element();
		const body = (element?.ownerDocument ?? document).body;

		const scrollableTarget = touchLike && body ? this._findGestureScrollableTouchTarget(target, body) : null;
		const ignoreScrollableTarget = startOptions?.ignoreScrollableTarget ?? false;
		if (scrollableTarget && !ignoreScrollableTarget) return false;
		this._swipeFromScrollable = Boolean(scrollableTarget && ignoreScrollableTarget);

		const isInteractiveElement = closest(target, DEFAULT_IGNORE_SELECTOR);
		if (isInteractiveElement && (!touchLike || (this._options.ignoreSelectorWhenTouch ?? true))) return false;

		if (this._options.ignoreScrollableAncestors && element && target) {
			const ignoreAncestors = startOptions?.ignoreScrollableAncestors ?? false;
			if (!ignoreAncestors && findScrollableAncestor(target, element, this._scrollAxis) != null) return false;
		}

		this._cancelledSwipe = false;
		this._intendedSwipeDirection = undefined;
		this._maxSwipeDisplacement = 0;

		this._dragStartPos = position;
		this._swipeStartTime = getValidTimeStamp(event.timeStamp);
		this._lastDragSample = null;
		this._hasStationarySample = false;
		this._lastDragVelocity = { x: 0, y: 0 };
		this._swipeCancelBaseline = position;
		this._lastMovePos = position;
		this._swipeThreshold = this._defaultSwipeThreshold;
		const threshold = this._options.swipeThreshold;
		this._swipeThresholdFunction = typeof threshold === 'function' ? threshold : null;

		if (element) {
			this._elementSize = { width: element.offsetWidth, height: element.offsetHeight };
			this._resolveSwipeThreshold(this._primaryDirection);
			const transform = getElementTransform(element);

			this._initialTransform = transform;
			this._dragOffset = { x: transform.x, y: transform.y };
			this._recordDragSample({ x: transform.x, y: transform.y }, this._swipeStartTime);

			if (!isTouchEvent(event)) safelyChangePointerCapture(element, event.pointerId, 'setPointerCapture');
		}

		this._options.onSwipeStart?.(event);

		this._setSwiping(true);
		this._isFirstPointerMove = true;
		this._updateSwipeProgress(0);
		this._syncDragStyles(true);

		return true;
	}

	private _resetPendingSwipeState(): void {
		this._clearPendingSwipeStartState();
		this._swipeFromScrollable = false;
		this._lastMovePos = null;
	}

	private _clearPendingSwipeStartState(): void {
		this._pendingSwipe = false;
		this._pendingSwipeStartPos = null;
	}

	private _canSwipeFromScrollEdgeOnPendingMove(
		scrollTarget: HTMLElement,
		deltaX: number,
		deltaY: number,
	): boolean | null {
		// Swiping toward the axis start edge (down/right) is allowed when scrolled to the start;
		// toward the end edge (up/left) when scrolled to the end.
		const directions = this._directions;
		const canSwipeOnAxis = (
			delta: number,
			scrollOffset: number,
			maxScrollOffset: number,
			towardStart: SwipeDirection,
			towardEnd: SwipeDirection,
		) =>
			(delta > 0 && scrollOffset <= 0 && directions.includes(towardStart)) ||
			(delta < 0 && scrollOffset >= Math.max(0, maxScrollOffset) && directions.includes(towardEnd));

		if (this._hasVertical && deltaY !== 0) {
			return canSwipeOnAxis(
				deltaY,
				scrollTarget.scrollTop,
				scrollTarget.scrollHeight - scrollTarget.clientHeight,
				'down',
				'up',
			);
		}

		if (this._hasHorizontal && deltaX !== 0) {
			return canSwipeOnAxis(
				deltaX,
				scrollTarget.scrollLeft,
				scrollTarget.scrollWidth - scrollTarget.clientWidth,
				'right',
				'left',
			);
		}

		return null;
	}

	private _handleMoveCore(
		event: SwipeDismissEvent,
		currentTarget: HTMLElement,
		position: { x: number; y: number },
		movement: { x: number; y: number },
	): void {
		if (!this._options.enabled() || !this._isSwiping) return;

		const directions = this._directions;
		const target = getTarget(event);
		if (isTouchLikeEvent(event) && !this._swipeFromScrollable) {
			if (this._findGestureScrollableTouchTarget(target, currentTarget)) return;
		}

		// Prevent text selection on Safari.
		if (!isTouchEvent(event)) event.preventDefault();

		if (this._isFirstPointerMove) {
			this._isFirstPointerMove = false;
			// Re-base the drag origin on the first move to absorb the gap between press and first move
			// (notably iOS touch), which would otherwise make the element jump. Without drag tracking
			// (the swipe area) keep the press position so a single-move flick still registers.
			if (this._trackDrag) {
				this._dragStartPos = position;
				const moveTime = getValidTimeStamp(event.timeStamp);
				if (moveTime !== null) this._swipeStartTime = moveTime;
				this._lastDragSample = null;
				this._hasStationarySample = false;
			}
		}

		this._swipeCancelBaseline = updateSwipeCancelBaseline(this._swipeCancelBaseline, position, movement);

		const deltaX = position.x - this._dragStartPos.x;
		const deltaY = position.y - this._dragStartPos.y;
		const cancelDeltaY = position.y - this._swipeCancelBaseline.y;
		const cancelDeltaX = position.x - this._swipeCancelBaseline.x;

		if (!this._intendedSwipeDirection) {
			let candidate: SwipeDirection;
			if (Math.abs(deltaX) >= Math.abs(deltaY)) {
				candidate = deltaX > 0 ? 'right' : 'left';
			} else {
				candidate = deltaY > 0 ? 'down' : 'up';
			}
			if (directions.includes(candidate)) {
				this._intendedSwipeDirection = candidate;
				this._maxSwipeDisplacement = getDisplacement(candidate, deltaX, deltaY);
				this._swipeDirection.set(candidate);
				this._resolveSwipeThreshold(candidate);
			}
		} else {
			const direction = this._intendedSwipeDirection;
			const currentDisplacement = getDisplacement(direction, cancelDeltaX, cancelDeltaY);
			if (currentDisplacement > this._swipeThreshold) {
				this._cancelledSwipe = false;
				this._swipeDirection.set(direction);
			} else if (shouldCancelReverseSwipe(directions, this._maxSwipeDisplacement, currentDisplacement)) {
				// A change of mind occurred.
				this._cancelledSwipe = true;
			}
		}

		const dampedDelta = applyDirectionalDamping(deltaX, deltaY, directions);
		let newOffsetX = this._initialTransform.x;
		let newOffsetY = this._initialTransform.y;
		if (this._hasHorizontal) newOffsetX += dampedDelta.x;
		if (this._hasVertical) newOffsetY += dampedDelta.y;

		// Only rewrite drag styles when the offset changed: `onProgress` overwrites them with damped
		// styles, but progress updates are deduped, so an unchanged move would reinstate raw styles.
		const previousOffset = this._dragOffset;
		const offsetChanged = newOffsetX !== previousOffset.x || newOffsetY !== previousOffset.y;

		this._dragOffset = { x: newOffsetX, y: newOffsetY };
		if (offsetChanged) this._syncDragStyles(true);
		this._recordDragSample({ x: newOffsetX, y: newOffsetY }, getValidTimeStamp(event.timeStamp));

		const dragDeltaX = newOffsetX - this._initialTransform.x;
		const dragDeltaY = newOffsetY - this._initialTransform.y;
		const progressDetails: SwipeProgressDetails = {
			deltaX: dragDeltaX,
			deltaY: dragDeltaY,
			direction: this._intendedSwipeDirection,
		};

		let progress = 0;
		const progressDirection = this._primaryDirection ?? this._intendedSwipeDirection;
		if (progressDirection) {
			const size =
				progressDirection === 'left' || progressDirection === 'right'
					? this._elementSize.width
					: this._elementSize.height;
			const scale = this._initialTransform.scale || 1;
			const progressDisplacement = getDisplacement(progressDirection, dragDeltaX, dragDeltaY);
			if (size > 0 && scale > 0 && progressDisplacement > 0) {
				progress = progressDisplacement / (size * scale);
			}
		}

		this._updateSwipeProgress(progress, progressDetails);
	}
}
