import { DOCUMENT } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	effect,
	type ElementRef,
	inject,
	input,
	output,
	signal,
	type Signal,
	untracked,
	viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	applyModalEffect,
	BRN_DRAWER_DEFAULT_DRAG_CLOSE_THRESHOLD,
	BRN_DRAWER_DEFAULT_DRAG_VELOCITY_THRESHOLD,
	BRN_DRAWER_DEFAULT_HEIGHT,
	BRN_DRAWER_DEFAULT_TWEEN_CONFIG,
	BRN_DRAWER_INDICATOR_ROTATION,
	BRN_DRAWER_OFFSCREEN_Y,
	BRN_DRAWER_REDUCED_MOTION_TWEEN_CONFIG,
	type BrnDrawerDetent,
	type BrnDrawerSnapPoint,
	type BrnDrawerState,
	type BrnDrawerTweenConfig,
	computeSnapPoints,
	handleHighVelocityDrag,
	handleLowVelocityDrag,
	preventScroll,
	trackDimensions,
	trackScrollPosition,
	trackVirtualKeyboard,
	tweenTo,
} from '@spartan-ng/brain/drawer';
import { DragGesture, type FullGestureState } from '@use-gesture/vanilla';
import { BehaviorSubject, type Subscription } from 'rxjs';

@Component({
	selector: 'hlm-drawer',
	exportAs: 'hlmDrawer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'pointer-events-none fixed inset-0 overflow-hidden',
		'[attr.data-state]': 'state()',
		'[style.visibility]': 'visibility()',
		'[style.z-index]': 'zIndex()',
	},
	template: `
		@if (state() !== 'closed') {
			<button
				class="fixed inset-0 z-[1] m-0 cursor-default touch-none border-none bg-black/80 p-0 select-none"
				style="-webkit-tap-highlight-color: transparent;"
				[style.opacity]="backdropOpacity()"
				[style.pointer-events]="backdropPointerEvents()"
				(click)="onBackdropTap()"
				aria-label="Close"
			></button>

			<div
				class="bg-background text-foreground border-border pointer-events-auto absolute bottom-0 left-0 z-[2] flex w-full flex-col rounded-t-lg border-t shadow-lg backdrop-blur-xl [will-change:transform]"
				#containerEl
				[style.transform]="containerTransform()"
				[style.height]="containerHeight()"
				[style.max-height]="containerMaxHeight()"
			>
				<div class="mb-6 w-full cursor-grab touch-none active:cursor-grabbing" #headerEl>
					<div class="flex h-10 w-full items-center justify-center">
						<div class="flex">
							<span
								class="bg-muted-foreground inline-block h-1 w-[18px] rounded-full"
								[style.transform]="indicator1Transform()"
							></span>
							<span
								class="bg-muted-foreground inline-block h-1 w-[18px] rounded-full"
								[style.transform]="indicator2Transform()"
							></span>
						</div>
					</div>
					<ng-content select="[hlmDrawerHeader]" />
				</div>

				<div class="relative flex min-h-0 flex-grow flex-col">
					<div
						class="h-full overflow-y-auto overscroll-y-none"
						#scrollerEl
						[style.touch-action]="scrollerTouchAction()"
						[style.padding-bottom]="scrollerPaddingBottom()"
					>
						<ng-content />
					</div>
				</div>
			</div>
		}
	`,
})
export class HlmDrawer {
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

	// --- View queries ---

	private readonly _containerEl = viewChild<ElementRef<HTMLDivElement>>('containerEl');
	private readonly _headerEl = viewChild<ElementRef<HTMLDivElement>>('headerEl');
	private readonly _scrollerEl = viewChild<ElementRef<HTMLDivElement>>('scrollerEl');

	// --- Injections ---

	private readonly _doc = inject(DOCUMENT);

	// --- Trackers (injection context) ---

	private readonly _dimensions = trackDimensions();
	private readonly _scrollTracker = trackScrollPosition();
	private readonly _keyboard = trackVirtualKeyboard();

	// --- State ---

	public readonly state = signal<BrnDrawerState>('closed');
	public readonly sheetHeight = signal(0);
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
		// The container extends below the viewport by `y` pixels at non-fully-open
		// snap points. Add matching padding so all content is scrollable into view.
		const overflowPx = Math.max(0, this._y());
		const keyboardPx = this.avoidKeyboard() ? 'env(keyboard-inset-height, var(--keyboard-inset-height, 0px))' : '0px';
		return `calc(${overflowPx}px + ${keyboardPx})`;
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

	protected async onBackdropTap(): Promise<void> {
		if (!this.disableDismiss()) {
			await this.animateTo(this.closedY());
			this.dismissed.emit();
		}
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
		effect(() => {
			const shouldPrevent = !this.disableScrollLocking() && this.state() !== 'closed';
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
	}

	private setupDragEffects(): void {
		effect((onCleanup) => {
			const header = this._headerEl();
			if (!header) return;
			const gesture = new DragGesture(header.nativeElement, (s) => this.onHeaderDrag(s), {
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

			// Watch for async content changes (e.g. API data arriving) that alter
			// scrollability. The browser reads touch-action at touchstart creation,
			// so we must update the DOM value before the user's next touch.
			const contentObserver = new MutationObserver(() => this.syncScrollerTouchAction());
			contentObserver.observe(el, { childList: true, subtree: true });

			onCleanup(() => {
				gesture.destroy();
				contentObserver.disconnect();
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
