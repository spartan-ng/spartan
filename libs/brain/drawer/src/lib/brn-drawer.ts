// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import type { BooleanInput } from '@angular/cdk/coercion';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
	booleanAttribute,
	computed,
	DestroyRef,
	Directive,
	effect,
	forwardRef,
	inject,
	input,
	model,
	signal,
	untracked,
} from '@angular/core';
import { BrnDialog, type BrnDialogOptions } from '@spartan-ng/brain/dialog';
import { BrnDrawerProvider } from './brn-drawer-provider';
import { resolveActiveSnapPoint, resolveSnapPoints, type BrnDrawerSnapPoint } from './utils/snap-points';
import type { SwipeDirection } from './utils/swipe-dismiss';

export type BrnDrawerSwipeDirection = SwipeDirection;

/**
 * - `true`: focus is trapped, page scroll is locked and outside pointer interactions are blocked.
 * - `'trap-focus'`: focus is trapped, but page scroll and outside interactions are allowed.
 * - `false`: nothing is trapped or locked; moving focus outside closes the drawer.
 */
export type BrnDrawerModal = boolean | 'trap-focus';

/** The element the drawer focuses when it opens, unless `autoFocus` is set. */
const DRAWER_POPUP_SELECTOR = '[data-drawer-popup]';

/** Notifies listeners of nested swipe progress without going through change detection. */
export class BrnDrawerNestedSwipeProgressStore {
	private _progress = 0;
	private readonly _listeners = new Set<() => void>();

	public getSnapshot(): number {
		return this._progress;
	}

	public set(progress: number): void {
		const resolved = Number.isFinite(progress) ? progress : 0;
		if (resolved === this._progress) return;
		this._progress = resolved;
		this._listeners.forEach((listener) => listener());
	}

	public subscribe(listener: () => void): () => void {
		this._listeners.add(listener);
		return () => this._listeners.delete(listener);
	}
}

function modalAttribute(value: BooleanInput | 'trap-focus'): BrnDrawerModal {
	return value === 'trap-focus' ? value : booleanAttribute(value);
}

@Directive({
	selector: '[brnDrawer],brn-drawer',
	exportAs: 'brnDrawer',
	providers: [{ provide: BrnDialog, useExisting: forwardRef(() => BrnDrawer) }],
})
export class BrnDrawer<
	TResult = unknown,
	TContext extends Record<string, unknown> = Record<string, unknown>,
> extends BrnDialog<TResult, TContext> {
	private readonly _scrollStrategyOptions = inject(ScrollStrategyOptions);
	private readonly _platform = inject(Platform);
	private readonly _provider = inject(BrnDrawerProvider, { optional: true });

	/** The closest drawer this one is nested in, if any. */
	public readonly parentDrawer: BrnDrawer | null = inject(BrnDrawer, { optional: true, skipSelf: true });
	/** Whether the drawer is nested within another drawer. */
	public readonly nested = this.parentDrawer !== null;

	/** The direction the drawer is swiped to dismiss it. */
	public readonly swipeDirection = input<BrnDrawerSwipeDirection>('down');
	/** How the drawer traps focus and blocks the rest of the page. */
	public readonly modal = input<BrnDrawerModal, BooleanInput | 'trap-focus'>(true, { transform: modalAttribute });
	/** Snap points the drawer can rest at, see `BrnDrawerSnapPoint`. */
	public readonly snapPoints = input<readonly BrnDrawerSnapPoint[] | undefined>(undefined);
	/** The snap point the drawer opens at. Defaults to the first snap point. */
	public readonly defaultSnapPoint = input<BrnDrawerSnapPoint | null | undefined>(undefined);
	/** Disables velocity based snap skipping, so a fast swipe only moves to the adjacent point. */
	public readonly snapToSequentialPoints = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
	/** The active snap point. `undefined` uses `defaultSnapPoint`. */
	public readonly snapPoint = model<BrnDrawerSnapPoint | null | undefined>(undefined);

	/** The payload of the trigger that opened the drawer. */
	public readonly payload = signal<unknown>(undefined);

	public readonly resolvedDefaultSnapPoint = computed<BrnDrawerSnapPoint | null>(() => {
		const defaultSnapPoint = this.defaultSnapPoint();
		return defaultSnapPoint !== undefined ? defaultSnapPoint : (this.snapPoints()?.[0] ?? null);
	});
	public readonly activeSnapPoint = computed<BrnDrawerSnapPoint | null>(() => {
		const snapPoint = this.snapPoint();
		return snapPoint === undefined ? this.resolvedDefaultSnapPoint() : snapPoint;
	});
	public readonly hasSnapPoints = computed(() => (this.snapPoints()?.length ?? 0) > 0);

	/** Whether the drawer is open (not just mounted while its exit transition runs). */
	public readonly isOpen = computed(() => this.stateComputed() === 'open');
	/** Whether the drawer is rendered, including while its exit transition runs. */
	public readonly mounted = computed(() => this.stateComputed() === 'open' || this.transitionStatus() === 'ending');

	/** The measured height of the popup. */
	public readonly popupHeight = signal(0);
	/** The measured height of the frontmost open drawer within this drawer's nested stack. */
	public readonly frontmostHeight = signal(0);
	/** Whether a nested drawer is present (open or transitioning out). */
	public readonly hasNestedDrawer = signal(false);
	/** Whether a nested drawer is being swiped. */
	public readonly nestedSwiping = signal(false);
	/** The number of open drawers nested in this one. */
	public readonly nestedOpenDrawerCount = signal(0);
	public readonly nestedSwipeProgressStore = new BrnDrawerNestedSwipeProgressStore();

	/** Registered by `brnDrawerViewport` and `brnDrawerPopup` while the drawer is rendered. */
	public readonly viewportElement = signal<HTMLElement | null>(null);
	public readonly popupElement = signal<HTMLElement | null>(null);
	public readonly backdropElement = signal<HTMLElement | null>(null);

	/** Measured by the viewport, used to resolve snap points. */
	public readonly viewportHeight = signal(0);
	public readonly rootFontSize = signal(16);

	public readonly resolvedSnapPoints = computed(() =>
		resolveSnapPoints(this.snapPoints(), this.popupHeight(), this.viewportHeight(), this.rootFontSize()),
	);
	public readonly activeSnapPointOffset = computed<number | null>(
		() =>
			resolveActiveSnapPoint(
				this.activeSnapPoint(),
				this.resolvedSnapPoints(),
				this.popupHeight(),
				this.viewportHeight(),
				this.rootFontSize(),
			)?.offset ?? null,
	);

	/** Whether a swipe area is driving an open gesture and writing the popup's movement vars. */
	public swipeAreaActive = false;
	private _isNestedDrawerOpen = false;
	private _reportedToParent = false;
	private readonly _document = inject(DOCUMENT);
	/** Whether a swipe area opened the drawer: focus then returns without scrolling the page. */
	private readonly _openedBySwipeArea = signal(false);
	private _focusBeforeSwipeAreaOpen: HTMLElement | null = null;

	constructor() {
		super();

		this.stateChanged.subscribe((state) => {
			if (state === 'closed' && this.hasSnapPoints()) this.setActiveSnapPoint(this.resolvedDefaultSnapPoint());
		});

		// Reset the nested drawer counts once fully closed.
		effect(() => {
			if (!this.mounted()) untracked(() => this.nestedOpenDrawerCount.set(0));
		});

		// Report this drawer, plus the drawers nested in it, to the parent while open, and zero once it
		// closes. A drawer that never opened must not touch the count a sibling reports.
		effect(() => {
			const parent = this.parentDrawer;
			if (!parent) return;
			const open = this.isOpen();
			if (!open && !this._reportedToParent) return;
			const count = open ? this.nestedOpenDrawerCount() + 1 : 0;
			this._reportedToParent = open;
			untracked(() => parent.nestedOpenDrawerCount.set(count));
		});

		effect(() => {
			const open = this.isOpen();
			untracked(() => this._provider?.setDrawerOpen(this, open));
		});

		inject(DestroyRef).onDestroy(() => {
			if (this._reportedToParent) this.parentDrawer?.nestedOpenDrawerCount.set(0);
			this._provider?.removeDrawer(this);
		});

		this._connectCloseWatcher();

		// The swipe area doesn't take focus, so the element focused before it opened the drawer can be
		// anywhere on the page. The CDK restores focus without `preventScroll`, which would scroll to it.
		this.closed.subscribe(() => {
			const target = this._focusBeforeSwipeAreaOpen;
			this._focusBeforeSwipeAreaOpen = null;
			this._openedBySwipeArea.set(false);
			const active = this._document.activeElement;
			if (target?.isConnected && (!active || active === this._document.body)) target.focus({ preventScroll: true });
		});
	}

	public setActiveSnapPoint(snapPoint: BrnDrawerSnapPoint | null): void {
		this.snapPoint.set(snapPoint);
	}

	public onPopupHeightChange(height: number): void {
		this.popupHeight.set(height);
		if (!this._isNestedDrawerOpen && height > 0) this.frontmostHeight.set(height);
	}

	public onNestedFrontmostHeightChange(height: number): void {
		if (height > 0) {
			this._isNestedDrawerOpen = true;
			this.frontmostHeight.set(height);
			return;
		}

		this._isNestedDrawerOpen = false;
		const popupHeight = this.popupHeight();
		if (popupHeight > 0) this.frontmostHeight.set(popupHeight);
	}

	public onNestedDrawerPresenceChange(present: boolean): void {
		this.hasNestedDrawer.set(present);
	}

	public onNestedSwipeProgressChange(progress: number): void {
		this.nestedSwipeProgressStore.set(progress);
		this.parentDrawer?.onNestedSwipeProgressChange(progress);
	}

	public onNestedSwipingChange(swiping: boolean): void {
		this.nestedSwiping.set(swiping);
		this.parentDrawer?.onNestedSwipingChange(swiping);
	}

	protected override getPositionStrategy(): BrnDialogOptions['positionStrategy'] {
		// The viewport inside the pane positions the popup, so the pane covers the whole screen.
		return this.positionStrategy() ?? this._positionBuilder.global().top('0').left('0');
	}

	/** Opens the drawer from a swipe area gesture. */
	public openFromSwipeArea(): void {
		if (!this.isOpen()) {
			const active = this._document.activeElement;
			this._focusBeforeSwipeAreaOpen = active instanceof HTMLElement && active !== this._document.body ? active : null;
			this._openedBySwipeArea.set(true);
		}
		this.open();
	}

	protected override resolveOptions(options: Partial<BrnDialogOptions>): Partial<BrnDialogOptions> {
		const modal = this.modal();
		const restoreFocusWithoutScroll = this._openedBySwipeArea() && options.restoreFocus === true;
		return {
			...options,
			restoreFocus: restoreFocusWithoutScroll ? false : options.restoreFocus,
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			maxHeight: '100%',
			hasBackdrop: modal === true && options.hasBackdrop,
			scrollStrategy: modal === true ? options.scrollStrategy : this._scrollStrategyOptions.noop(),
			trapFocus: modal !== false,
			closeOnFocusOut: modal === false && !!options.closeOnOutsidePointerEvents,
			autoFocus: options.autoFocus === this._defaultOptions.autoFocus ? DRAWER_POPUP_SELECTOR : options.autoFocus,
		};
	}

	/** Lets the Android back gesture close the topmost open drawer (Chromium only). */
	private _connectCloseWatcher(): void {
		if (!this._platform.ANDROID) return;

		effect((onCleanup) => {
			if (!this.isOpen() || this.nestedOpenDrawerCount() > 0) return;

			const CloseWatcher = (window as Window & { CloseWatcher?: new () => EventTarget & { destroy(): void } })
				.CloseWatcher;
			if (!CloseWatcher) return;

			const closeWatcher = new CloseWatcher();
			// The browser destroys the watcher before `close` fires, so handle the request on `cancel`.
			closeWatcher.addEventListener('cancel', (event) => {
				// Preventing the cancel keeps the watcher alive for the next back gesture.
				if (this.disableClose()) {
					event.preventDefault();
					return;
				}
				this.close();
			});
			onCleanup(() => closeWatcher.destroy());
		});
	}
}
