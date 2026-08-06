import { Injectable, signal } from '@angular/core';

import { areScrollStatesEqual, areVisibilityStatesEqual } from './brn-message-scroller.equality';
import {
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
import type {
	BrnMessageScrollerDefaultScrollPosition,
	BrnMessageScrollerMode,
	BrnMessageScrollerProviderProps,
	BrnMessageScrollerRegisterMessage,
	BrnMessageScrollerScrollable,
	BrnMessageScrollerScrollOptions,
	BrnMessageScrollerVisibilityState,
} from './brn-message-scroller.types';
import {
	AUTOSCROLLING_CLEAR_DELAY,
	DEFAULT_SCROLL_EDGE_THRESHOLD,
	DEFAULT_SCROLL_MARGIN,
	DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
	EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
	EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
	SCROLL_POSITION_EPSILON,
} from './brn-message-scroller.types';

/**
 * Headless message-scroller controller. Owns scroll behavior and state; renders no DOM.
 * Combine refs, commands, and controller policy from the shadcn React implementation.
 */
@Injectable()
export class BrnMessageScroller {
	private _autoScroll = false;
	private _autoscrolling = false;
	private _autoscrollingTimeout: ReturnType<typeof setTimeout> | null = null;
	private _streamingTurn: HTMLElement | null = null;
	private _content: HTMLDivElement | null = null;
	private _defaultScrollPosition: BrnMessageScrollerDefaultScrollPosition = 'end';
	private _defaultScrollPositionApplied = false;
	private _firstItem: HTMLElement | null = null;
	private _itemCount = 0;
	private _lastScrollTop = 0;
	private readonly _messageElements = new Map<string, HTMLElement>();
	private _mode: BrnMessageScrollerMode = 'free-scrolling';
	private _pendingScrollFrame: number | null = null;
	private _pendingScrollToMessage: {
		messageId: string;
		options?: BrnMessageScrollerScrollOptions;
	} | null = null;
	private _prependRestore: {
		element: HTMLElement;
		viewportTop: number;
	} | null = null;
	private _preserveScrollOnPrepend = true;
	private _root: HTMLDivElement | null = null;
	private _scrollEdgeThreshold = DEFAULT_SCROLL_EDGE_THRESHOLD;
	private _scrollMargin = DEFAULT_SCROLL_MARGIN;
	private _scrollPreviousItemPeek = DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK;
	private _spacerGap = 0;
	private _spacerHeight = 0;
	private _spacer: HTMLDivElement | null = null;
	/** Height queued before the spacer mounts (created after hydration). */
	private _pendingSpacerHeight: number | null = null;
	private _stateFrame: number | null = null;
	private _viewport: HTMLDivElement | null = null;
	private _visibilityFrame: number | null = null;
	private _visibilityObserver: IntersectionObserver | null = null;
	private _visibilityTracking = false;
	private readonly _visibleMessageIds = new Set<string>();
	private _handledScrollAnchors = new WeakSet<HTMLElement>();
	private _destroyed = false;

	private readonly _scrollable = signal<BrnMessageScrollerScrollable>(EMPTY_MESSAGE_SCROLLER_SCROLLABLE);
	private readonly _visibility = signal<BrnMessageScrollerVisibilityState>(EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE);

	/** Scrollable edges snapshot (start / end overflow). */
	public readonly scrollable = this._scrollable.asReadonly();

	/** Visibility snapshot (current anchor + visible message ids). Requires observeVisibility(). */
	public readonly visibility = this._visibility.asReadonly();

	/**
	 * @internal
	 * Whether prepend scroll preservation is enabled (mirrored from viewport).
	 */
	public get preserveScrollOnPrepend(): boolean {
		return this._preserveScrollOnPrepend;
	}

	/** @internal */
	public set preserveScrollOnPrepend(value: boolean) {
		this._preserveScrollOnPrepend = value;
	}

	/**
	 * @internal
	 * Apply provider configuration. Safe to call when inputs change.
	 */
	public configure(props: BrnMessageScrollerProviderProps): void {
		if (this._destroyed) {
			return;
		}

		const previousAutoScroll = this._autoScroll;
		const previousDefaultScrollPosition = this._defaultScrollPosition;
		const previousScrollEdgeThreshold = this._scrollEdgeThreshold;
		const previousScrollMargin = this._scrollMargin;
		const previousScrollPreviousItemPeek = this._scrollPreviousItemPeek;

		if (props.autoScroll !== undefined) {
			this._autoScroll = props.autoScroll;
			// Mirror React's initial modeRef: autoScroll starts in following-bottom.
			if (this._autoScroll && this._itemCount === 0) {
				this._mode = 'following-bottom';
			}
		}
		if (props.defaultScrollPosition !== undefined) {
			this._defaultScrollPosition = props.defaultScrollPosition;
		}
		if (props.scrollEdgeThreshold !== undefined) {
			this._scrollEdgeThreshold = props.scrollEdgeThreshold;
		}
		if (props.scrollPreviousItemPeek !== undefined) {
			this._scrollPreviousItemPeek = props.scrollPreviousItemPeek;
		}
		if (props.scrollMargin !== undefined) {
			this._scrollMargin = props.scrollMargin;
		}

		if (previousDefaultScrollPosition !== this._defaultScrollPosition) {
			this._defaultScrollPositionApplied = false;
			this.applyDefaultScrollPosition();
		}

		// IntersectionObserver rootMargin is fixed at construction. Rebuild when the
		// reading-line inputs change so visibleMessageIds stay aligned with geometry.
		const visibilityMarginsChanged =
			this._scrollMargin !== previousScrollMargin ||
			this._scrollPreviousItemPeek !== previousScrollPreviousItemPeek;
		if (this._visibilityTracking && visibilityMarginsChanged) {
			this._visibilityObserver?.disconnect();
			this._visibilityObserver = null;
			this.observeVisibility();
		}

		if (props.autoScroll !== undefined && props.autoScroll !== previousAutoScroll) {
			if (this._autoScroll && this._mode === 'following-bottom' && this._itemCount > 0) {
				this.scrollToEnd({ behavior: 'auto' });
				return;
			}

			this.commitScrollState();
			return;
		}

		// Edge threshold feeds data-scrollable / jump-button active state.
		if (this._scrollEdgeThreshold !== previousScrollEdgeThreshold) {
			this.commitScrollState();
		}
	}

	/**
	 * Scroll a registered `messageId` into view.
	 * Queues the request when the item is not mounted yet (empty transcript).
	 * @returns false when the id is unknown and items are already present
	 */
	public scrollToMessage(messageId: string, options?: BrnMessageScrollerScrollOptions): boolean {
		if (this._destroyed) {
			return false;
		}

		const element = this._messageElements.get(messageId);

		if (!element) {
			if (this._itemCount === 0) {
				this._pendingScrollToMessage = {
					messageId,
					options,
				};
				this._defaultScrollPositionApplied = true;

				return true;
			}

			return false;
		}

		this._defaultScrollPositionApplied = true;

		if (this.scrollToElement(element, options)) {
			this._pendingScrollToMessage = null;
			return true;
		}

		this._pendingScrollToMessage = {
			messageId,
			options,
		};

		return true;
	}

	/**
	 * Jump to the live end of the transcript.
	 * With `autoScroll`, re-enters following-bottom mode.
	 */
	public scrollToEnd({ behavior = 'auto' }: BrnMessageScrollerScrollOptions = {}): boolean {
		if (this._destroyed) {
			return false;
		}

		const viewport = this._viewport;

		if (!viewport) {
			return false;
		}

		this.setTailSpacerHeight(0);
		this._streamingTurn = null;
		this._mode = this._autoScroll ? 'following-bottom' : 'free-scrolling';
		this.scrollToPosition(getMaxScrollTop(viewport), {
			autoscrolling: true,
			behavior,
		});
		this.scheduleVisibilitySync();

		return true;
	}

	/** Jump to the start of the transcript and leave follow/anchor modes. */
	public scrollToStart({ behavior = 'auto' }: BrnMessageScrollerScrollOptions = {}): boolean {
		if (this._destroyed || !this._viewport) {
			return false;
		}

		this.setTailSpacerHeight(0);
		this._streamingTurn = null;
		this._mode = 'free-scrolling';
		this.scrollToPosition(0, { behavior });
		this.scheduleVisibilitySync();

		return true;
	}

	/** @internal */
	public registerMessage: BrnMessageScrollerRegisterMessage = (messageId, element, removedElement) => {
		if (this._destroyed) {
			return;
		}

		if (element) {
			this._messageElements.set(messageId, element);
			this._visibilityObserver?.observe(element);
			this.scheduleVisibilitySync();

			if (this._pendingScrollToMessage?.messageId === messageId) {
				this.schedulePendingScrollToMessageFlush();
			}

			return;
		}

		if (removedElement && this._messageElements.get(messageId) === removedElement) {
			this._messageElements.delete(messageId);
			this._visibleMessageIds.delete(messageId);
			this._visibilityObserver?.unobserve(removedElement);
			this.scheduleVisibilitySync();
		}
	};

	/** @internal */
	public handleContentChange(): void {
		if (this._destroyed) {
			return;
		}

		const content = this._content;

		if (!content) {
			return;
		}

		const items = getMessageScrollerItems(content, this._spacer);
		const previousItemCount = this._itemCount;
		const previousFirstItem = this._firstItem;

		this._itemCount = items.length;
		this._firstItem = items[0] ?? null;

		// Reconcile the scroll position with the new content. Every path re-captures
		// the prepend anchor afterward, so each branch just returns.
		//
		// Branch order is load-bearing: first-content, prepended, appended, updated.
		const reconcileScrollPosition = () => {
			if (this.flushPendingScrollToMessage()) {
				return;
			}

			if (previousItemCount === 0) {
				if (this.applyDefaultScrollPosition()) {
					return;
				}

				if (items.length > 0 && this._autoScroll && this.scrollToEnd({ behavior: 'auto' })) {
					return;
				}

				this.commitScrollState();
				this.scheduleVisibilitySync();
				return;
			}

			const previousFirstItemIndex = previousFirstItem ? items.indexOf(previousFirstItem) : -1;
			const didPrepend = this._preserveScrollOnPrepend && previousFirstItemIndex > 0;

			if (didPrepend) {
				// Prepended rows are not new appends. Restore the prior scroll position.
				// The restore is a no-op where native scroll anchoring already did it.
				this.restorePrependedAnchor();
				return;
			}

			if (items.length > previousItemCount) {
				const anchor = getNewScrollAnchor(items, previousItemCount);

				if (anchor) {
					// Following-bottom + multiple new anchors: stay at end (don't yank to the first).
					if (
						this._autoScroll &&
						this._mode === 'following-bottom' &&
						hasMultipleNewScrollAnchors(items, previousItemCount)
					) {
						this.scrollToEnd({ behavior: 'auto' });
						return;
					}

					this.scrollToElement(anchor, { align: 'start' }, { keepPreviousPeek: true });
					this._handledScrollAnchors.add(anchor);
					return;
				}
			}

			if (items.length === previousItemCount) {
				const anchor = getUnanchoredScrollAnchor(items, this._handledScrollAnchors);

				if (anchor) {
					this.scrollToElement(anchor, { align: 'start' }, { keepPreviousPeek: true });
					this._handledScrollAnchors.add(anchor);
					return;
				}
			}

			// Appends with no new anchor (and content-only updates) fall through here:
			// keep following the end if we still are, otherwise just recommit state.
			if (this._mode === 'following-bottom' && this._autoScroll) {
				this.scrollToEnd({ behavior: 'auto' });
			} else {
				this.commitScrollState();
				this.scheduleVisibilitySync();
			}
		};

		reconcileScrollPosition();
		this.capturePrependAnchor();
	}

	/** @internal */
	public handleResize(): void {
		if (this._destroyed) {
			return;
		}

		if (this._mode === 'following-bottom' && this._autoScroll) {
			this.scrollToEnd({ behavior: 'auto' });
			return;
		}

		// Re-pin the anchored turn while content below it resizes (streaming reply).
		const previousSpacerHeight = this._spacerHeight;

		if (this.reanchorToAnchoredMessage()) {
			// Spacer drained (>0 → 0): reply filled the viewport — hand off to follow-bottom.
			// Skip when there was never a spacer (tall turn) so we don't yank off the hold.
			if (this._autoScroll && previousSpacerHeight > 0 && this._spacerHeight === 0) {
				this.scrollToEnd({ behavior: 'auto' });
			}

			return;
		}

		this.scheduleStateCommit();
		this.scheduleVisibilitySync();
	}

	/** @internal */
	public syncAfterScroll(): void {
		if (this._destroyed) {
			return;
		}

		this.commitScrollState();
		this.scheduleVisibilitySync();
		this.capturePrependAnchor();
	}

	/** @internal */
	public userScrollIntent(): void {
		if (this._destroyed) {
			return;
		}

		if (this._mode === 'following-bottom' || this._mode === 'anchored-to-message' || this._mode === 'settling-jump') {
			// User gesture wins over follow / anchor / in-flight jump.
			this._streamingTurn = null;
			this._mode = 'free-scrolling';
		}
	}

	/**
	 * Start tracking `visibility` (current anchor + visible message ids).
	 * Uses IntersectionObserver when available; otherwise falls back to layout.
	 */
	public observeVisibility(): void {
		if (this._destroyed) {
			return;
		}

		this._visibilityTracking = true;

		const viewport = this._viewport;

		if (!viewport) {
			return;
		}

		if (typeof IntersectionObserver === 'undefined') {
			this.scheduleVisibilitySync();
			return;
		}

		if (!this._visibilityObserver) {
			this._visibilityObserver = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						const messageId = (entry.target as HTMLElement).dataset['messageId'];

						if (!messageId) {
							continue;
						}

						if (entry.isIntersecting) {
							this._visibleMessageIds.add(messageId);
						} else {
							this._visibleMessageIds.delete(messageId);
						}
					}

					this.scheduleVisibilitySync();
				},
				{
					root: viewport,
					// Exclude the peek band above the reading line from "visible".
					rootMargin: `${-(this._scrollMargin + this._scrollPreviousItemPeek)}px 0px 0px 0px`,
					threshold: [0, 0.01, 0.5, 1],
				},
			);
		}

		this._messageElements.forEach((element) => {
			this._visibilityObserver?.observe(element);
		});
		this.scheduleVisibilitySync();
	}

	/** Stop visibility tracking and reset the `visibility` signal. */
	public unobserveVisibility(): void {
		if (this._visibilityFrame !== null) {
			window.cancelAnimationFrame(this._visibilityFrame);
			this._visibilityFrame = null;
		}

		this._visibilityObserver?.disconnect();
		this._visibilityObserver = null;
		this._visibleMessageIds.clear();
		this._visibilityTracking = false;
		this._visibility.set(EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE);
	}

	/** @internal */
	public setRootElement(element: HTMLDivElement | null): void {
		// Ignore null clears on remount: Angular builds the new tree before destroying the old.
		if (element === null) {
			return;
		}

		this._root = element;
		this.writeStateAttributes(this._scrollable());
	}

	/** @internal */
	public clearRootElement(element: HTMLDivElement): void {
		if (this._root === element) {
			this._root = null;
		}
	}

	/** @internal */
	public setViewportElement(element: HTMLDivElement | null): void {
		if (element === null) {
			return;
		}

		this._viewport = element;
		this.writeStateAttributes(this._scrollable());

		// Visibility may have been requested before the viewport mounted.
		if (this._visibilityTracking) {
			this._visibilityObserver?.disconnect();
			this._visibilityObserver = null;
			this.observeVisibility();
		}
	}

	/** @internal */
	public clearViewportElement(element: HTMLDivElement): void {
		if (this._viewport !== element) {
			return;
		}

		this._visibilityObserver?.disconnect();
		this._visibilityObserver = null;
		this._viewport = null;
	}

	/** @internal */
	public setContentElement(element: HTMLDivElement | null): void {
		if (element === null) {
			return;
		}

		if (this._content === element) {
			return;
		}

		this._content = element;
		// Provider outlives keyed scroller remounts — reset reconcile counters so the
		// next tree is treated as first content again (defaultScrollPosition, anchors).
		this.resetForContentMount();
	}

	/** @internal */
	public clearContentElement(element: HTMLDivElement): void {
		if (this._content === element) {
			this._content = null;
		}
	}

	/** @internal */
	public setSpacerElement(element: HTMLDivElement | null): void {
		if (element === null) {
			return;
		}

		this._spacer = element;
		this._spacerGap = getFlexGap(element.parentElement ?? null);

		if (this._pendingSpacerHeight !== null) {
			const pendingHeight = this._pendingSpacerHeight;
			this._pendingSpacerHeight = null;
			// Force apply even when the logical height already matches.
			this._spacerHeight = -1;
			this.setTailSpacerHeight(pendingHeight);
		}
	}

	/** @internal */
	public clearSpacerElement(element: HTMLDivElement): void {
		if (this._spacer === element) {
			this._spacer = null;
			this._spacerGap = 0;
		}
	}

	private resetForContentMount(): void {
		this._itemCount = 0;
		this._firstItem = null;
		this._defaultScrollPositionApplied = false;
		this._streamingTurn = null;
		this._mode = this._autoScroll ? 'following-bottom' : 'free-scrolling';
		this._spacerHeight = 0;
		this._pendingSpacerHeight = null;
		this._prependRestore = null;
		this._pendingScrollToMessage = null;
		this._handledScrollAnchors = new WeakSet<HTMLElement>();
		this._lastScrollTop = 0;
		// Drop stale overflow flags so a remounted scroll button does not flash active.
		this._scrollable.set(EMPTY_MESSAGE_SCROLLER_SCROLLABLE);
		this.writeStateAttributes(EMPTY_MESSAGE_SCROLLER_SCROLLABLE);
	}

	/** @internal */
	public destroy(): void {
		this._destroyed = true;

		if (typeof window !== 'undefined') {
			if (this._stateFrame !== null) {
				window.cancelAnimationFrame(this._stateFrame);
				this._stateFrame = null;
			}

			if (this._visibilityFrame !== null) {
				window.cancelAnimationFrame(this._visibilityFrame);
				this._visibilityFrame = null;
			}

			if (this._pendingScrollFrame !== null) {
				window.cancelAnimationFrame(this._pendingScrollFrame);
				this._pendingScrollFrame = null;
			}
		} else {
			this._stateFrame = null;
			this._visibilityFrame = null;
			this._pendingScrollFrame = null;
		}

		if (this._autoscrollingTimeout !== null) {
			clearTimeout(this._autoscrollingTimeout);
			this._autoscrollingTimeout = null;
		}

		this._visibilityObserver?.disconnect();
		this._visibilityObserver = null;
		this._visibilityTracking = false;
		this._visibleMessageIds.clear();
	}

	private setAutoScrolling(autoscrolling: boolean): void {
		if (this._destroyed) {
			return;
		}

		if (this._autoscrollingTimeout !== null) {
			clearTimeout(this._autoscrollingTimeout);
			this._autoscrollingTimeout = null;
		}

		if (this._autoscrolling !== autoscrolling) {
			this._autoscrolling = autoscrolling;
			this.commitScrollState();
		}

		if (autoscrolling) {
			this._autoscrollingTimeout = setTimeout(() => {
				this._autoscrollingTimeout = null;
				this._autoscrolling = false;
				this.commitScrollState();
			}, AUTOSCROLLING_CLEAR_DELAY);
		}
	}

	private setTailSpacerHeight(height: number): void {
		const nextHeight = Math.max(0, Math.ceil(height));
		const spacer = this._spacer;

		if (!spacer) {
			this._spacerHeight = nextHeight;
			this._pendingSpacerHeight = nextHeight;
			return;
		}

		this._pendingSpacerHeight = null;

		if (this._spacerHeight === nextHeight) {
			return;
		}

		this._spacerHeight = nextHeight;
		spacer.hidden = nextHeight === 0;
		spacer.style.height = `${nextHeight}px`;
		spacer.style.marginTop = nextHeight > 0 ? `${-this._spacerGap}px` : '';
	}

	private scrollToPosition(
		scrollTop: number,
		{
			behavior = 'auto',
			autoscrolling = false,
		}: {
			behavior?: ScrollBehavior;
			autoscrolling?: boolean;
		} = {},
	): void {
		const viewport = this._viewport;

		if (!viewport) {
			return;
		}

		const nextScrollTop = Math.max(0, scrollTop);

		if (Math.abs(viewport.scrollTop - nextScrollTop) <= SCROLL_POSITION_EPSILON) {
			viewport.scrollTop = nextScrollTop;
			this.commitScrollState();
			return;
		}

		if (autoscrolling) {
			this.setAutoScrolling(true);
		}

		viewport.scrollTo({
			top: nextScrollTop,
			behavior,
		});
		this.scheduleStateCommit();
	}

	private scrollToElement(
		element: HTMLElement,
		{ align = 'start', behavior = 'auto', scrollMargin = this._scrollMargin }: BrnMessageScrollerScrollOptions = {},
		{
			keepPreviousPeek = false,
		}: {
			keepPreviousPeek?: boolean;
		} = {},
	): boolean {
		const content = this._content;
		const viewport = this._viewport;

		if (!content || !viewport || !content.contains(element)) {
			return false;
		}

		const scrollTop = getElementScrollTop({
			align,
			element,
			scrollMargin: keepPreviousPeek ? scrollMargin + this._scrollPreviousItemPeek : scrollMargin,
			spacer: this._spacer,
			viewport,
		});

		const nextSpacerHeight = getTailSpacerHeight({
			content,
			scrollTop,
			spacer: this._spacer,
			viewport,
		});

		this.setTailSpacerHeight(nextSpacerHeight);
		// Seed the prepend anchor with the jump target so a prepend that lands
		// before this scroll settles still preserves the jumped-to row; once it
		// settles, syncAfterScroll's capturePrependAnchor re-captures it from the
		// first visible row.
		this._prependRestore = {
			element,
			viewportTop: getElementViewportTop(element, viewport),
		};

		this._mode = keepPreviousPeek ? 'anchored-to-message' : 'settling-jump';
		this._streamingTurn = keepPreviousPeek ? element : null;

		this.scrollToPosition(scrollTop, { behavior });
		this.scheduleVisibilitySync();

		return true;
	}

	private reanchorToAnchoredMessage(): boolean {
		const element = this._streamingTurn;

		if (!element || !element.isConnected || this._mode !== 'anchored-to-message') {
			return false;
		}

		// Re-run the placement so the tail spacer is recomputed for the new content
		// height and the turn is held at the reading line.
		return this.scrollToElement(element, { align: 'start' }, { keepPreviousPeek: true });
	}

	private flushPendingScrollToMessage(): boolean {
		const pending = this._pendingScrollToMessage;

		if (!pending) {
			return false;
		}

		const element = this._messageElements.get(pending.messageId);

		if (!element) {
			return false;
		}

		const handled = this.scrollToElement(element, pending.options);

		if (!handled) {
			return false;
		}

		this._pendingScrollToMessage = null;
		this._defaultScrollPositionApplied = true;

		return true;
	}

	private writeStateAttributes(state: BrnMessageScrollerScrollable): void {
		const root = this._root;
		const viewport = this._viewport;
		const scrollable = [state.start && 'start', state.end && 'end'].filter(Boolean).join(' ');
		const autoScrolling = this._autoscrolling;

		for (const element of [root, viewport]) {
			if (!element) {
				continue;
			}

			if (scrollable) {
				element.setAttribute('data-scrollable', scrollable);
			} else {
				element.removeAttribute('data-scrollable');
			}

			element.toggleAttribute('data-autoscrolling', autoScrolling);
		}
	}

	/** Arm follow-bottom at the end; release only on real upward scroll (not content growth). */
	private reconcileFollowMode(scrollable: BrnMessageScrollerScrollable): void {
		const scrollTop = this._viewport?.scrollTop ?? 0;
		// Growth can look like "not at end" before follow catches up — only scrollTop rising releases.
		const scrolledUp = scrollTop < this._lastScrollTop - SCROLL_POSITION_EPSILON;

		this._lastScrollTop = scrollTop;

		if (this._autoScroll && !scrollable.end && this._mode !== 'settling-jump' && this._mode !== 'anchored-to-message') {
			this._mode = 'following-bottom';
		} else if (this._mode === 'following-bottom' && scrollable.end && scrolledUp && !this._autoscrolling) {
			this._mode = 'free-scrolling';
		}
	}

	private commitScrollState(): void {
		if (
			typeof window === 'undefined' ||
			!this._viewport ||
			typeof this._viewport.getBoundingClientRect !== 'function'
		) {
			return;
		}

		const nextState = getMessageScrollerScrollable({
			content: this._content,
			scrollEdgeThreshold: this._scrollEdgeThreshold,
			spacer: this._spacer,
			viewport: this._viewport,
		});

		this.reconcileFollowMode(nextState);

		// Suppress end-overflow while following so the jump button does not strobe per chunk.
		const publishedState = this._mode === 'following-bottom' ? { ...nextState, end: false } : nextState;

		this.writeStateAttributes(publishedState);

		if (!areScrollStatesEqual(this._scrollable(), publishedState)) {
			this._scrollable.set(publishedState);
		}
	}

	private scheduleStateCommit(): void {
		if (this._stateFrame !== null || typeof window === 'undefined') {
			return;
		}

		this._stateFrame = window.requestAnimationFrame(() => {
			this._stateFrame = null;
			this.commitScrollState();
		});
	}

	private scheduleVisibilitySync(): void {
		if (!this._visibilityTracking) {
			return;
		}

		if (this._visibilityFrame !== null || typeof window === 'undefined') {
			return;
		}

		this._visibilityFrame = window.requestAnimationFrame(() => {
			this._visibilityFrame = null;

			// Skip if unsubscribed while this frame was queued.
			if (!this._visibilityTracking) {
				return;
			}

			const next = getMessageScrollerVisibilityState({
				content: this._content,
				scrollMargin: this._scrollMargin,
				scrollPreviousItemPeek: this._scrollPreviousItemPeek,
				spacer: this._spacer,
				viewport: this._viewport,
				visibleMessageIds: this._visibleMessageIds,
			});

			if (!areVisibilityStatesEqual(this._visibility(), next)) {
				this._visibility.set(next);
			}
		});
	}

	private restorePrependedAnchor(): boolean {
		const anchor = this._prependRestore;
		const viewport = this._viewport;

		if (!anchor || !viewport || !anchor.element.isConnected) {
			return false;
		}

		// Viewport-relative delta: no-op when native anchoring already held; corrects Safari, etc.
		const nextViewportTop = getElementViewportTop(anchor.element, viewport);
		const delta = nextViewportTop - anchor.viewportTop;

		if (Math.abs(delta) <= SCROLL_POSITION_EPSILON) {
			return false;
		}

		viewport.scrollTop += delta;
		anchor.viewportTop = getElementViewportTop(anchor.element, viewport);
		this.scheduleStateCommit();
		this.scheduleVisibilitySync();

		return true;
	}

	private capturePrependAnchor(): void {
		const content = this._content;
		const viewport = this._viewport;

		if (!content || !viewport) {
			this._prependRestore = null;
			return;
		}

		const anchor = getFirstVisibleMessageItem({
			content,
			spacer: this._spacer,
			viewport,
		});

		this._prependRestore = anchor
			? {
					element: anchor,
					viewportTop: getElementViewportTop(anchor, viewport),
				}
			: null;
	}

	private schedulePendingScrollToMessageFlush(): void {
		if (this._pendingScrollFrame !== null || typeof window === 'undefined') {
			return;
		}

		this._pendingScrollFrame = window.requestAnimationFrame(() => {
			this._pendingScrollFrame = null;

			if (this.flushPendingScrollToMessage()) {
				this.capturePrependAnchor();
			}
		});
	}

	private applyDefaultScrollPosition(): boolean {
		if (!this._defaultScrollPosition || this._defaultScrollPositionApplied || this._itemCount === 0) {
			return false;
		}

		let handled = false;

		if (this._defaultScrollPosition === 'last-anchor') {
			const content = this._content;
			const viewport = this._viewport;
			const anchor = content && viewport ? getLastScrollAnchor(getMessageScrollerItems(content, this._spacer)) : null;

			if (!content || !viewport || !anchor) {
				handled = this.scrollToEnd({ behavior: 'auto' });
			} else {
				const anchorTop = getElementTop(anchor, viewport);
				const contentBottom = getContentBottom({
					content,
					spacer: this._spacer,
					viewport,
				});
				// A short last turn already fits below the anchor, so opening at the end
				// shows the whole turn without leaving a blank gap beneath it.
				const lastTurnFits = contentBottom - anchorTop <= viewport.clientHeight;

				handled = lastTurnFits
					? this.scrollToEnd({ behavior: 'auto' })
					: this.scrollToElement(anchor, { align: 'start' }, { keepPreviousPeek: true });
			}
		} else {
			handled =
				this._defaultScrollPosition === 'end'
					? this.scrollToEnd({ behavior: 'auto' })
					: this.scrollToStart({ behavior: 'auto' });
		}

		if (!handled) {
			return false;
		}

		this._defaultScrollPositionApplied = true;

		return true;
	}
}
