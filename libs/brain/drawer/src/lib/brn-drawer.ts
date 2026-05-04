import { DOCUMENT } from '@angular/common';
import {
	computed,
	DestroyRef,
	Directive,
	effect,
	type ElementRef,
	inject,
	input,
	output,
	signal,
	type Signal,
	untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DragGesture, type FullGestureState } from '@use-gesture/vanilla';
import { BehaviorSubject, type Subscription } from 'rxjs';
import {
	BRN_DRAWER_DEFAULT_DRAG_CLOSE_THRESHOLD,
	BRN_DRAWER_DEFAULT_DRAG_VELOCITY_THRESHOLD,
	BRN_DRAWER_DEFAULT_HEIGHT,
	BRN_DRAWER_DEFAULT_TWEEN_CONFIG,
	BRN_DRAWER_INDICATOR_ROTATION,
	BRN_DRAWER_OFFSCREEN_Y,
	BRN_DRAWER_REDUCED_MOTION_TWEEN_CONFIG,
} from './constants';
import { trackDimensions } from './effects/dimensions';
import { applyModalEffect } from './effects/modal-effect';
import { preventScroll } from './effects/prevent-scroll';
import { trackScrollPosition } from './effects/scroll-position';
import { trackVirtualKeyboard } from './effects/virtual-keyboard';
import type { BrnDrawerDetent, BrnDrawerSnapPoint, BrnDrawerState, BrnDrawerTweenConfig } from './types';
import { computeSnapPoints, handleHighVelocityDrag, handleLowVelocityDrag } from './utils/snap';
import { tweenTo } from './utils/tween';

/**
 * Headless coordinator directive for the drawer primitive.
 *
 * Holds the full state machine (`closed` / `opening` / `open` / `closing`),
 * gesture integration, snap-point resolver, scroll-lock, virtual-keyboard
 * avoidance, and optional Vaul-style modal-effect. Sub-directives
 * (`brnDrawerContent`, `brnDrawerHandle`, `brnDrawerScroller`,
 * `brnDrawerFooter`, `brnDrawerOverlay`) register their element refs here
 * so the coordinator can attach behaviour without owning a template.
 */
let drawerIdSequence = 0;

@Directive({
	selector: '[brnDrawer],brn-drawer',
	exportAs: 'brnDrawer',
	host: {
		role: 'dialog',
		'aria-modal': 'true',
		'[id]': 'drawerId',
		'[attr.aria-hidden]': 'state() === "closed" ? true : null',
		'[attr.data-state]': 'state()',
		'[style.visibility]': 'visibility()',
		'[style.z-index]': 'zIndex()',
	},
})
export class BrnDrawer {
	/**
	 * Stable id rendered onto the drawer's host element. Used by
	 * `[brnDrawerTrigger]` for `aria-controls`. Auto-generated unique per
	 * instance — exposed publicly so consumers can override via DOM if they
	 * need a deterministic id (rare).
	 */
	public readonly drawerId = `brn-drawer-${++drawerIdSequence}`;

	// --- Inputs ---

	public readonly isOpen = input(false);
	public readonly detent = input<BrnDrawerDetent>('default');
	public readonly snapPoints = input<number[] | undefined>(undefined);
	public readonly initialSnap = input<number | undefined>(undefined);
	public readonly disableDrag = input(false);
	public readonly disableDismiss = input(false);
	public readonly disableScrollLocking = input(false);
	public readonly avoidKeyboard = input(true);
	public readonly tweenConfig = input<BrnDrawerTweenConfig | undefined>(undefined);
	public readonly prefersReducedMotion = input(false);
	public readonly modalEffectRootId = input<string | undefined>(undefined);
	public readonly modalEffectThreshold = input<number | undefined>(undefined);

	// --- Outputs ---

	public readonly dismissed = output<void>();
	public readonly snapped = output<number>();
	public readonly openStart = output<void>();
	public readonly openEnd = output<void>();
	public readonly closeStart = output<void>();
	public readonly closeEnd = output<void>();

	// --- Registered sub-directive element refs ---

	private readonly _containerEl = signal<ElementRef<HTMLElement> | null>(null);
	private readonly _handleEl = signal<ElementRef<HTMLElement> | null>(null);
	private readonly _scrollerEl = signal<ElementRef<HTMLElement> | null>(null);
	private readonly _footerEl = signal<ElementRef<HTMLElement> | null>(null);

	/** @internal Called by `[brnDrawerContent]` to register the draggable container. */
	public registerContainer(ref: ElementRef<HTMLElement> | null): void {
		this._containerEl.set(ref);
	}
	/** @internal Called by `[brnDrawerHandle]` to register the drag handle. */
	public registerHandle(ref: ElementRef<HTMLElement> | null): void {
		this._handleEl.set(ref);
	}
	/** @internal Called by `[brnDrawerScroller]` to register the scrollable body. */
	public registerScroller(ref: ElementRef<HTMLElement> | null): void {
		this._scrollerEl.set(ref);
	}
	/** @internal Called by `[brnDrawerFooter]` to register the fixed footer. */
	public registerFooter(ref: ElementRef<HTMLElement> | null): void {
		this._footerEl.set(ref);
	}

	// --- Injections ---

	private readonly _doc = inject(DOCUMENT);

	// --- Trackers (injection context) ---

	private readonly _dimensions = trackDimensions();
	private readonly _scrollTracker = trackScrollPosition();
	private readonly _keyboard = trackVirtualKeyboard();

	// --- State ---

	public readonly state = signal<BrnDrawerState>('closed');
	public readonly sheetHeight = signal(0);
	public readonly footerHeight = signal(0);
	private readonly _y$ = new BehaviorSubject<number>(BRN_DRAWER_OFFSCREEN_Y);
	private readonly _y = toSignal(this._y$, { initialValue: BRN_DRAWER_OFFSCREEN_Y });
	private readonly _currentSnap = signal<number | undefined>(undefined);
	private readonly _indicatorRotation = signal(0);
	private _transitioning = false;
	private _animSub?: Subscription;
	private _preventScrollCleanup: (() => void) | undefined = undefined;
	private _modalEffect?: { setup: () => void; cleanup: () => void };

	// --- Drag state ---

	private _gestureActive = false;

	// --- Computed ---

	public readonly closedY = computed(() => {
		const h = this.sheetHeight();
		return h > 0 ? h : this._dimensions.windowHeight();
	});

	public readonly visibility = computed(() => (this._y() + 2 >= this.closedY() ? 'hidden' : 'visible'));
	public readonly zIndex = computed(() => (this._y() + 2 >= this.closedY() ? -1 : BRN_DRAWER_OFFSCREEN_Y));
	public readonly containerTransform = computed(() => `translate3d(0, ${this._y()}px, 0)`);

	public readonly backdropOpacity = computed(() => {
		const closedYVal = this.closedY();
		return closedYVal > 0 ? Math.max(0, 1 - this._y() / closedYVal) : 0;
	});
	public readonly backdropPointerEvents = computed(() => (this.backdropOpacity() > 0 ? 'auto' : 'none'));

	public readonly containerHeight = computed(() => {
		switch (this.detent()) {
			case 'full':
				return '100%';
			case 'content':
				return 'auto';
			default:
				return BRN_DRAWER_DEFAULT_HEIGHT;
		}
	});
	public readonly containerMaxHeight = computed(() =>
		this.detent() === 'content' ? BRN_DRAWER_DEFAULT_HEIGHT : 'none',
	);

	public readonly indicator1Transform = computed(() => `translateX(2px) rotate(${this._indicatorRotation()}deg)`);
	public readonly indicator2Transform = computed(() => `translateX(-2px) rotate(${-this._indicatorRotation()}deg)`);

	public readonly scrollerPaddingBottom = computed(() => {
		// Reserve space for the virtual keyboard so content can scroll past
		// it on iOS. Footer space is no longer added here — the scroller is
		// sized to end above the footer via `scrollerMaxHeight`, so the
		// footer never overlays content and no padding is needed for it.
		const keyboardPx = this.avoidKeyboard() ? 'env(keyboard-inset-height, var(--keyboard-inset-height, 0px))' : '0px';
		return keyboardPx;
	});

	// Cap the scroller height so its bottom edge stops above the footer
	// and ends inside the visible portion of the drawer. The drawer
	// container is always laid out at its full natural sheet height; at
	// any snap < 1 it is translated down by `_y` to reveal less than
	// 100 %. The footer is `position: absolute` and overlays the bottom
	// of the body wrapper. Without this cap the scroller (`h-full`)
	// would extend (a) under the footer at any snap, hiding content and
	// letting the native scrollbar render past the footer's top edge;
	// and (b) `_y` pixels below the viewport at non-fully-open snaps,
	// pushing the bottom of the scrollbar off-screen. Subtracting both
	// keeps the scroller's bottom anchored at the footer's top edge and
	// its full height visible inside the viewport.
	public readonly scrollerMaxHeight = computed(() => {
		const overflowPx = Math.max(0, this._y());
		const footerPx = this.footerHeight();
		const reservedPx = overflowPx + footerPx;
		return reservedPx === 0 ? '' : `calc(100% - ${reservedPx}px)`;
	});
	// Always allow browser-native touch handling on the scroller. The actual
	// drag-vs-scroll decision is made by our touchmove handler (preventDefault
	// for downward swipes at scroll-top) and preventScroll (blocks page scroll).
	// For non-scrollable content, disable browser touch gestures completely so
	// the very first swipe is captured by drawer drag instead of gesture
	// arbitration. Scrollable content keeps native touch scrolling.
	public readonly scrollerTouchAction = computed(() =>
		this._scrollTracker.isScrollable() || this._effectiveDisableDrag() ? '' : 'none',
	);

	/**
	 * Pixel offset from the container bottom at which the fixed footer sits.
	 *
	 * Counter-translates the footer against the container's current Y so it
	 * stays pinned to the bottom of the visible drawer area at any partial
	 * snap point. The counter-translate is capped at `sheetHeight - footerHeight`
	 * — past that cap the footer would sit above its natural in-flow position
	 * (i.e. detached from the drawer body), which manifests as the footer
	 * "left behind" at the viewport bottom while the body slides off during
	 * the close animation. With the cap, the last `footerHeight` pixels of a
	 * close (and the first `footerHeight` of an open) ride with the drawer
	 * body — the footer slides off / on screen alongside the rest of the
	 * drawer instead of staying detached.
	 */
	public readonly footerBottomPx = computed(() => {
		const y = Math.max(0, this._y());
		const sh = this.sheetHeight();
		const fh = this.footerHeight();
		if (sh <= 0) return y;
		return Math.min(y, Math.max(0, sh - fh));
	});

	private readonly _animConfig = computed<BrnDrawerTweenConfig>(() => {
		const win = this._doc.defaultView;
		const reduce =
			this.prefersReducedMotion() || (win?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false);
		return reduce ? BRN_DRAWER_REDUCED_MOTION_TWEEN_CONFIG : (this.tweenConfig() ?? BRN_DRAWER_DEFAULT_TWEEN_CONFIG);
	});

	private readonly _computedSnapPoints: Signal<BrnDrawerSnapPoint[]> = computed(() => {
		const sp = this.snapPoints();
		const h = this.sheetHeight();
		return sp && h > 0 ? computeSnapPoints({ sheetHeight: h, snapPointsProp: sp }) : [];
	});

	private readonly _effectiveDisableDrag = computed(() => this.disableDrag() || this._keyboard.isKeyboardOpen());

	private readonly _contentDragEnabled = computed(() => {
		if (this._effectiveDisableDrag()) return false;
		const sp = this._scrollTracker.scrollPosition();
		return !sp || sp === 'top';
	});

	// --- Setup ---

	constructor() {
		this.setupModalEffect();
		this.setupStateTransitions();
		this.setupScrollLocking();
		this.setupResizeObserver();
		this.setupDragEffects();
		this.setupKeyboardAvoidance();
		this.setupCleanup();
	}

	// --- Public API ---

	public async snapTo(snapIndex: number): Promise<void> {
		const snapPointsProp = this.snapPoints();
		if (!snapPointsProp) {
			console.warn('Snapping is not possible without `snapPoints` input.');
			return;
		}

		const snapPoint = this.getSnapPoint(snapIndex);
		if (snapPoint === null) {
			console.warn(`Invalid snap index ${snapIndex}.`);
			return;
		}

		if (snapIndex === 0) {
			this.dismissed.emit();
			return;
		}

		await this.animateTo(snapPoint.snapValueY);
		this.updateSnap(snapIndex);
	}

	/** @internal Called by `[brnDrawerOverlay]` on backdrop click. */
	public async onBackdropTap(): Promise<void> {
		if (!this.disableDismiss()) {
			await this.animateTo(this.closedY());
			this.dismissed.emit();
		}
	}

	/**
	 * Opens the drawer imperatively. Used by `[brnDrawerTrigger]` and friends.
	 * No-op if already open / opening or transitioning between states. Does not
	 * mutate the `isOpen` input — consumers using `[isOpen]` for one-way control
	 * remain in charge of their own signal; the trigger is an orthogonal entry
	 * point that drives the internal state machine directly.
	 */
	public open(): void {
		if (this._transitioning) return;
		if (this.state() !== 'closed') return;
		this.transitionTo('opening');
	}

	/**
	 * Closes the drawer imperatively. Mirror of {@link open}; same semantics
	 * around `isOpen` ownership.
	 */
	public close(): void {
		if (this._transitioning) return;
		const current = this.state();
		if (current !== 'open' && current !== 'opening') return;
		this.transitionTo('closing');
	}

	// --- State machine ---

	private async transitionTo(newState: BrnDrawerState): Promise<void> {
		this._transitioning = true;
		this.state.set(newState);

		try {
			switch (newState) {
				case 'opening':
					this.openStart.emit();
					await this.handleOpen();
					this.state.set('open');
					this.openEnd.emit();
					break;

				case 'closing':
					this.closeStart.emit();
					await this.handleClosing();
					this.state.set('closed');
					this.closeEnd.emit();
					break;
			}
		} catch (error) {
			console.error('Internal drawer state error:', error);
		} finally {
			this._transitioning = false;
		}

		// Check if isOpen changed during transition
		const open = this.isOpen();
		const current = this.state();
		if (open && current === 'closed') {
			this.transitionTo('opening');
		} else if (!open && (current === 'open' || current === 'opening')) {
			this.transitionTo('closing');
		}
	}

	// --- Animation ---

	private async handleOpen(): Promise<void> {
		// Wait for Angular CD to flush (@if renders, viewChild resolves)
		await new Promise<void>((r) => requestAnimationFrame(() => r()));

		const container = this._containerEl();
		if (!container) return;

		// ResizeObserver fires after rAF (between layout and paint), so sheetHeight
		// may still be 0. Sync-measure to guarantee snap-point computation works.
		if (this.sheetHeight() === 0) {
			this.sheetHeight.set(Math.round(container.nativeElement.getBoundingClientRect().height));
		}

		this._y$.next(this.closedY());

		const initialSnap = this.initialSnap();
		const snapPoint = initialSnap !== undefined ? this.getSnapPoint(initialSnap) : null;
		await this.animateTo(snapPoint?.snapValueY ?? 0);

		if (initialSnap !== undefined) {
			this.updateSnap(initialSnap);
		}

		// Sync scroller layout after animation settles. The browser reads
		// touch-action at touchstart creation (before any JS handler runs),
		// so the correct value must be in the DOM before the user's first touch.
		this.syncScrollerTouchAction();
	}

	private async handleClosing(): Promise<void> {
		await this.animateTo(this.closedY());
	}

	private animateTo(to: number): Promise<void> {
		this._animSub?.unsubscribe();
		const from = this._y$.value;

		return new Promise<void>((resolve) => {
			let completed = false;
			this._animSub = tweenTo(from, to, this._animConfig()).subscribe({
				next: (val) => this._y$.next(val),
				complete: () => {
					completed = true;
					resolve();
				},
			});
			this._animSub.add(() => {
				if (!completed) resolve();
			});
		});
	}

	// --- Snap points ---

	private getSnapPoint(snapIndex: number): BrnDrawerSnapPoint | null {
		const snapPoints = this._computedSnapPoints();
		const snapPointsProp = this.snapPoints();
		if (snapPointsProp && snapPoints.length > 0) {
			if (snapIndex < 0 || snapIndex >= snapPoints.length) {
				console.warn(`Invalid snap index ${snapIndex}. Snap points are: [${snapPointsProp.join(', ')}]`);
				return null;
			}
			return snapPoints[snapIndex] ?? null;
		}
		return null;
	}

	private updateSnap(snapIndex: number): void {
		this._currentSnap.set(snapIndex);
		this.snapped.emit(snapIndex);
	}

	// --- Drag handling ---

	private onHeaderDrag(state: FullGestureState<'drag'>): void {
		if (this._effectiveDisableDrag()) return;

		if (state.first) this.onDragStart();
		if (state.active) this.onDrag(state.delta[1]);

		if (state.last) {
			const velocity = state.velocity[1] * state.direction[1] * 1000; // px/ms → signed px/s
			this.onDragEnd(velocity, state.movement[1]);
		}
	}

	private onScrollerDrag(state: FullGestureState<'drag'>): 'accepted' | undefined {
		if (this._effectiveDisableDrag()) {
			this._gestureActive = false;
			return undefined;
		}

		if (state.first) {
			if (!this._contentDragEnabled()) return undefined;

			// Non-scrollable content: accept immediately so the very first swipe
			// is tracked without the "undecided" phase that would eat the gesture.
			if (!this._scrollTracker.isScrollable()) {
				this._gestureActive = true;
				this.onDragStart();
				return 'accepted';
			}

			return undefined; // scrollable content: undecided — wait for direction
		}

		// Scrollable content: determine direction before accepting
		if (state.memo === undefined) {
			if (state.movement[1] <= 0) return undefined; // upward → native scroll handles it
			if (!this._contentDragEnabled()) return undefined; // scrolled away from top during gesture
			this._gestureActive = true;
			this.onDragStart();
			this.onDrag(state.movement[1]); // apply accumulated displacement
			return 'accepted';
		}

		// Gesture accepted — track drag
		if (state.active) this.onDrag(state.delta[1]);

		if (state.last) {
			this._gestureActive = false;
			const velocity = state.velocity[1] * state.direction[1] * 1000;
			this.onDragEnd(velocity, state.movement[1]);
		}

		return state.memo;
	}

	private onDragStart(): void {
		this._animSub?.unsubscribe();

		// Blur active input to prevent ghost caret on mobile
		const focused = this._doc.activeElement as HTMLElement | null;
		const container = this._containerEl()?.nativeElement;
		if (!focused || !container) return;

		const isInput = focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA';
		if (isInput && container.contains(focused)) {
			focused.blur();
		}
	}

	private onDrag(deltaY: number): void {
		if (deltaY > 0) this._indicatorRotation.set(BRN_DRAWER_INDICATOR_ROTATION);
		if (deltaY < 0) this._indicatorRotation.set(-BRN_DRAWER_INDICATOR_ROTATION);
		this._y$.next(Math.min(Math.max(this._y$.value + deltaY, 0), this.closedY()));
	}

	private onDragEnd(velocity: number, offsetY: number): void {
		const currentY = this._y$.value;
		const sheetH = this.sheetHeight();
		const closedY = this.closedY();
		const snapPoints = this._computedSnapPoints();

		let yTo = 0;

		if (snapPoints.length > 0) {
			const dragOffsetDirection = offsetY > 0 ? 'down' : 'up';
			const dragVelocityDirection: 'up' | 'down' = velocity > 0 ? 'down' : 'up';
			const isHighVelocity = Math.abs(velocity) > BRN_DRAWER_DEFAULT_DRAG_VELOCITY_THRESHOLD;

			const result = isHighVelocity
				? handleHighVelocityDrag({ snapPoints, dragDirection: dragVelocityDirection })
				: handleLowVelocityDrag({
						currentY,
						dragDirection: dragOffsetDirection,
						snapPoints,
						velocity,
					});

			yTo = result.yTo;

			if (this.disableDismiss() && yTo + 1 >= sheetH) {
				const bottomSnapPoint = snapPoints.find((s) => s.snapValue > 0);
				if (bottomSnapPoint) {
					yTo = bottomSnapPoint.snapValueY;
					this.updateSnap(bottomSnapPoint.snapIndex);
				} else {
					yTo = currentY;
				}
			} else if (result.snapIndex !== undefined) {
				this.updateSnap(result.snapIndex);
			}
		} else if (
			velocity > BRN_DRAWER_DEFAULT_DRAG_VELOCITY_THRESHOLD ||
			currentY > sheetH * BRN_DRAWER_DEFAULT_DRAG_CLOSE_THRESHOLD
		) {
			yTo = this.disableDismiss() ? 0 : closedY;
		}

		this.animateTo(yTo).then(() => {
			if (yTo + 1 >= sheetH && !this.disableDismiss()) {
				this.dismissed.emit();
			}
		});

		this._indicatorRotation.set(0);
	}

	// --- Effect setup (called from constructor) ---

	private setupModalEffect(): void {
		this._modalEffect = applyModalEffect({
			y$: this._y$,
			detent: this.detent,
			sheetHeight: this.sheetHeight,
			snapPoints: this._computedSnapPoints,
			rootId: this.modalEffectRootId,
			startThreshold: this.modalEffectThreshold,
		});

		effect(() => {
			const rootId = this.modalEffectRootId();
			untracked(() => {
				if (rootId) this._modalEffect?.setup();
				else this._modalEffect?.cleanup();
			});
		});
	}

	private setupStateTransitions(): void {
		effect(() => {
			const open = this.isOpen();
			untracked(() => {
				const current = this.state();
				if (open && current === 'closed' && !this._transitioning) {
					this.transitionTo('opening');
				} else if (!open && (current === 'open' || current === 'opening') && !this._transitioning) {
					this.transitionTo('closing');
				}
			});
		});
	}

	private setupScrollLocking(): void {
		// Apply lock only after the open animation finishes (state === 'open'),
		// and release before the close animation starts. The iOS `position:
		// fixed` lock removes <body> from the document flow, forcing a layout
		// reflow of the page behind the drawer (sticky elements detach,
		// scrollbars disappear, sub-pixel rendering shifts). Doing that in
		// the middle of the open animation produces visible reflow artefacts
		// on stacked content; once the drawer is at rest the backdrop is
		// fully opaque and any reflow behind it is hidden.
		effect(() => {
			const shouldPrevent = !this.disableScrollLocking() && this.state() === 'open';
			untracked(() => {
				if (shouldPrevent && !this._preventScrollCleanup) {
					this._preventScrollCleanup = preventScroll(this._doc);
				} else if (!shouldPrevent && this._preventScrollCleanup) {
					this._preventScrollCleanup();
					this._preventScrollCleanup = undefined;
				}
			});
		});
	}

	private setupResizeObserver(): void {
		effect((onCleanup) => {
			const container = this._containerEl();
			if (!container) return;

			const observer = new ResizeObserver((entries) => {
				const entry = entries[0];
				if (!entry) return;
				this.sheetHeight.set(Math.round(entry.contentRect.height));
			});
			observer.observe(container.nativeElement);
			onCleanup(() => observer.disconnect());
		});

		effect((onCleanup) => {
			const footer = this._footerEl();
			if (!footer) {
				this.footerHeight.set(0);
				return;
			}

			const observer = new ResizeObserver((entries) => {
				const entry = entries[0];
				if (!entry) return;
				this.footerHeight.set(Math.round(entry.contentRect.height));
			});
			observer.observe(footer.nativeElement);
			onCleanup(() => observer.disconnect());
		});
	}

	private setupDragEffects(): void {
		effect((onCleanup) => {
			const handle = this._handleEl();
			if (!handle) return;
			const gesture = new DragGesture(handle.nativeElement, (s) => this.onHeaderDrag(s), {
				pointer: { touch: true },
				axis: 'y',
			});
			onCleanup(() => gesture.destroy());
		});

		effect((onCleanup) => {
			const scroller = this._scrollerEl();
			if (!scroller) return;
			const el = scroller.nativeElement;

			this._scrollTracker.attach(el);
			const gesture = new DragGesture(el, (s) => this.onScrollerDrag(s), {
				pointer: { touch: true },
				axis: 'y',
			});

			// Prevent default on downward touch at scroll top so the browser
			// doesn't claim the gesture — allows our drag handler to close the drawer.
			// Upward touches pass through for native content scrolling.
			let touchStartY = 0;
			const onTouchStart = (e: TouchEvent): void => {
				touchStartY = e.touches[0]?.clientY ?? 0;
			};
			const onTouchMove = (e: TouchEvent): void => {
				// Once a drawer drag is active, always prevent default so the browser
				// doesn't reclaim the gesture when the finger reverses direction.
				if (this._gestureActive) {
					e.preventDefault();
					return;
				}
				const sp = this._scrollTracker.scrollPosition();
				if (sp && sp !== 'top') return;
				const dy = (e.touches[0]?.clientY ?? 0) - touchStartY;
				if (dy > 0) e.preventDefault();
			};
			el.addEventListener('touchstart', onTouchStart, { passive: true });
			el.addEventListener('touchmove', onTouchMove, { passive: false });

			// Watch for async content changes that alter scrollability so we can
			// refresh `touch-action` before the user's next touch (the browser reads
			// it at touchstart creation, before any JS handler runs).
			//
			// We need to catch any size change of the content, not just structural
			// ones. A consumer that rebuilds its body with the same wrapper element
			// and only updates inner text produces a `characterData` mutation, not
			// a `childList` one — and that text change can flip the body from
			// "fits the viewport" to "overflows it" with zero DOM-structure change.
			// A single `MutationObserver` with `childList: true` misses this entirely
			// and leaves `touch-action: 'none'` on the scroller, killing native scroll.
			//
			// `ResizeObserver` on every direct child closes the gap: it fires for
			// any size change regardless of cause (text wrap, image load, CSS
			// animation, etc.). The `MutationObserver` keeps that set of observed
			// children in sync as the framework adds / removes them.
			const sync = (): void => this.syncScrollerTouchAction();
			const childResizeObserver = new ResizeObserver(sync);
			const observedChildren = new WeakSet<Element>();
			const observeChild = (child: Node): void => {
				if (child instanceof Element && !observedChildren.has(child)) {
					observedChildren.add(child);
					childResizeObserver.observe(child);
				}
			};
			const unobserveChild = (child: Node): void => {
				if (child instanceof Element && observedChildren.has(child)) {
					observedChildren.delete(child);
					childResizeObserver.unobserve(child);
				}
			};
			// Bootstrap: observe children that already exist when the scroller mounts.
			el.childNodes.forEach(observeChild);
			const contentObserver = new MutationObserver((records) => {
				let touched = false;
				for (const record of records) {
					record.addedNodes.forEach((n) => {
						observeChild(n);
						touched = true;
					});
					record.removedNodes.forEach((n) => {
						unobserveChild(n);
						touched = true;
					});
				}
				if (touched) sync();
			});
			contentObserver.observe(el, { childList: true });

			onCleanup(() => {
				gesture.destroy();
				contentObserver.disconnect();
				childResizeObserver.disconnect();
				this._scrollTracker.detach();
				el.removeEventListener('touchstart', onTouchStart);
				el.removeEventListener('touchmove', onTouchMove);
			});
		});
	}

	private setupKeyboardAvoidance(): void {
		effect(() => {
			const open = this.isOpen();
			const kbOpen = this._keyboard.isKeyboardOpen();
			const snapPts = this._computedSnapPoints();
			const avoidKb = this.avoidKeyboard();

			if (!open || snapPts.length === 0 || !avoidKb || !kbOpen) return;

			untracked(() => {
				const sheetH = this.sheetHeight();
				const currentY = this._y$.value;
				const visibleSheetHeight = Math.max(sheetH - currentY, 0) - this._keyboard.keyboardHeight();

				if (visibleSheetHeight <= 0) {
					const focusedElement = this._doc.activeElement as HTMLElement | null;
					if (!focusedElement) return;

					const diffY = Math.max(currentY - Math.abs(visibleSheetHeight), 0);

					requestAnimationFrame(() => {
						const inputRect = focusedElement.getBoundingClientRect();
						const sheetRect = this._containerEl()?.nativeElement.getBoundingClientRect();
						const inputOffset = sheetRect ? inputRect.top - sheetRect.top + inputRect.height : 0;
						this.animateTo(diffY - inputOffset);
					});
				}
			});
		});
	}

	/** Force padding-bottom + scroll-tracker refresh + touch-action onto the DOM synchronously. */
	private syncScrollerTouchAction(): void {
		const scroller = this._scrollerEl()?.nativeElement;
		if (!scroller) return;
		scroller.style.paddingBottom = this.scrollerPaddingBottom();
		this._scrollTracker.refresh();
		scroller.style.touchAction = this.scrollerTouchAction();
	}

	private setupCleanup(): void {
		inject(DestroyRef).onDestroy(() => {
			this._animSub?.unsubscribe();
			this._preventScrollCleanup?.();
			this._modalEffect?.cleanup();
		});
	}
}
