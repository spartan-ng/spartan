/**
 * We are building on shoulders of giants here and adapt the implementation provided by the incredible Angular
 * team: https://github.com/angular/components/blob/main/src/material/tabs/paginated-tab-header.ts
 * Check them out! Give them a try! Leave a star! Their work is incredible!
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { FocusKeyManager, type FocusableOption } from '@angular/cdk/a11y';
import { type Direction, Directionality } from '@angular/cdk/bidi';
import { type BooleanInput } from '@angular/cdk/coercion';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { SharedResizeObserver } from '@angular/cdk/observers/private';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
	ANIMATION_MODULE_TYPE,
	type AfterContentChecked,
	type AfterContentInit,
	type AfterViewInit,
	ChangeDetectorRef,
	Directive,
	ElementRef,
	Injector,
	NgZone,
	type OnDestroy,
	type Signal,
	afterNextRender,
	booleanAttribute,
	computed,
	effect,
	inject,
	input,
	output,
	signal,
} from '@angular/core';
import { EMPTY, Observable, type Observer, Subject, fromEvent, merge, of as observableOf, timer } from 'rxjs';
import { debounceTime, filter, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { BrnTabs } from './brn-tabs';

/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
	passive: true,
}) as EventListenerOptions;

/**
 * The directions that scrolling can go in when the header's tabs exceed the header width. 'After'
 * will scroll the header towards the end of the tabs list and 'before' will scroll towards the
 * beginning of the list.
 */
export type ScrollDirection = 'after' | 'before';

/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
const HEADER_SCROLL_DELAY = 650;

/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 */
const HEADER_SCROLL_INTERVAL = 100;

/** Item inside a paginated tab header. */
export type BrnPaginatedTabHeaderItem = FocusableOption & { elementRef: ElementRef };

/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
@Directive()
export abstract class BrnTabsPaginatedList implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy {
	public abstract items: Signal<ReadonlyArray<BrnPaginatedTabHeaderItem>>;
	public abstract itemsChanges: Observable<ReadonlyArray<BrnPaginatedTabHeaderItem>>;
	public abstract tabListContainer: Signal<ElementRef<HTMLElement>>;
	public abstract tabList: Signal<ElementRef<HTMLElement>>;
	public abstract tabListInner: Signal<ElementRef<HTMLElement>>;
	public abstract nextPaginator: Signal<ElementRef<HTMLElement>>;
	public abstract previousPaginator: Signal<ElementRef<HTMLElement>>;

	/** The distance in pixels that the tab labels should be translated to the left. */
	private _scrollDistance = 0;

	/** Whether the header should scroll to the selected index after the view has been checked. */
	private _selectedIndexChanged = false;

	private readonly _root = inject(BrnTabs);
	private readonly _activeTab = this._root.$activeTab;
	private readonly _tabs = this._root.$tabs;

	/** Emits when the component is destroyed. */
	protected readonly _destroyed = new Subject<void>();

	/** Whether the controls for pagination should be displayed */
	public readonly showPaginationControls = signal(false);

	/** Whether the tab list can be scrolled more towards the end of the tab label list. */
	public disableScrollAfter = true;

	/** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
	public disableScrollBefore = true;

	/**
	 * The number of tab labels that are displayed on the header. When this changes, the header
	 * should re-evaluate the scroll position.
	 */
	private _tabLabelCount!: number;

	/** Whether the scroll distance has changed and should be applied after the view is checked. */
	private _scrollDistanceChanged!: boolean;

	/** Used to manage focus between the tabs. */
	private _keyManager!: FocusKeyManager<BrnPaginatedTabHeaderItem>;

	/** Cached text content of the header. */
	private _currentTextContent!: string;

	/** Stream that will stop the automated scrolling. */
	private readonly _stopScrolling = new Subject<void>();

	/**
	 * Whether pagination should be disabled. This can be used to avoid unnecessary
	 * layout recalculations if it's known that pagination won't be required.
	 */
	public readonly disablePagination = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/** The index of the active tab. */
	private readonly _selectedIndex = computed(() => {
		const currentTabKey = this._activeTab();
		const tabs = this._tabs();

		let activeIndex = 0;
		if (currentTabKey && this.items()) {
			const currentTab = tabs[currentTabKey];
			if (currentTab) {
				activeIndex = this.items().indexOf(currentTab.trigger);
			}
		}

		return activeIndex;
	});

	/** Event emitted when the option is selected. */
	public readonly selectFocusedIndex = output<number>();

	/** Event emitted when a label is focused. */
	public readonly indexFocused = output<number>();

	private readonly _sharedResizeObserver = inject(SharedResizeObserver);

	private readonly _injector = inject(Injector);

	protected _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	protected _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
	private readonly _viewportRuler: ViewportRuler = inject(ViewportRuler);
	private readonly _dir = inject(Directionality, { optional: true });
	private readonly _ngZone: NgZone = inject(NgZone);
	private readonly _platform: Platform = inject(Platform);
	public readonly animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });

	constructor() {
		// Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
		this._ngZone.runOutsideAngular(() => {
			fromEvent(this._elementRef.nativeElement, 'mouseleave')
				.pipe(takeUntil(this._destroyed))
				.subscribe(() => {
					this._stopInterval();
				});
		});

		effect(() => {
			const selectedIndex = this._selectedIndex();

			if (selectedIndex !== 0) {
				this._selectedIndexChanged = true;
				if (this._keyManager) {
					this._keyManager.updateActiveItem(selectedIndex);
				}
			}
		});
	}

	/** Called when the user has selected an item via the keyboard. */
	protected abstract _itemSelected(event: KeyboardEvent): void;

	ngAfterViewInit() {
		// We need to handle these events manually, because we want to bind passive event listeners.
		fromEvent(this.previousPaginator().nativeElement, 'touchstart', passiveEventListenerOptions)
			.pipe(takeUntil(this._destroyed))
			.subscribe(() => {
				this._handlePaginatorPress('before');
			});

		fromEvent(this.nextPaginator().nativeElement, 'touchstart', passiveEventListenerOptions)
			.pipe(takeUntil(this._destroyed))
			.subscribe(() => {
				this._handlePaginatorPress('after');
			});
	}

	ngAfterContentInit() {
		const dirChange = this._dir ? this._dir.change : observableOf('ltr');
		// We need to debounce resize events because the alignment logic is expensive.
		// If someone animates the width of tabs, we don't want to realign on every animation frame.
		// Once we haven't seen any more resize events in the last 32ms (~2 animaion frames) we can
		// re-align.
		const resize = this._sharedResizeObserver
			.observe(this._elementRef.nativeElement)
			.pipe(debounceTime(32), takeUntil(this._destroyed));
		// Note: We do not actually need to watch these events for proper functioning of the tabs,
		// the resize events above should capture any viewport resize that we care about. However,
		// removing this is fairly breaking for screenshot tests, so we're leaving it here for now.
		const viewportResize = this._viewportRuler.change(150).pipe(takeUntil(this._destroyed));

		const realign = () => {
			this.updatePagination();
		};

		this._keyManager = new FocusKeyManager<BrnPaginatedTabHeaderItem>(this.items())
			.withHorizontalOrientation(this._getLayoutDirection())
			.withHomeAndEnd()
			.withWrap()
			// Allow focus to land on disabled tabs, as per https://w3c.github.io/aria-practices/#kbd_disabled_controls
			.skipPredicate(() => false);

		this._keyManager.updateActiveItem(this._selectedIndex());

		// Note: We do not need to realign after the first render for proper functioning of the tabs
		// the resize events above should fire when we first start observing the element. However,
		// removing this is fairly breaking for screenshot tests, so we're leaving it here for now.
		afterNextRender(realign, { injector: this._injector });

		// On dir change or resize, realign the ink bar and update the orientation of
		// the key manager if the direction has changed.
		merge(dirChange, viewportResize, resize, this.itemsChanges, this._itemsResized())
			.pipe(takeUntil(this._destroyed))
			.subscribe(() => {
				// We need to defer this to give the browser some time to recalculate
				// the element dimensions. The call has to be wrapped in `NgZone.run`,
				// because the viewport change handler runs outside of Angular.
				this._ngZone.run(() => {
					Promise.resolve().then(() => {
						// Clamp the scroll distance, because it can change with the number of tabs.
						this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), this._scrollDistance));
						realign();
					});
				});
				this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
			});

		// If there is a change in the focus key manager we need to emit the `indexFocused`
		// event in order to provide a public event that notifies about focus changes. Also we realign
		// the tabs container by scrolling the new focused tab into the visible section.
		this._keyManager.change.subscribe((newFocusIndex) => {
			this.indexFocused.emit(newFocusIndex);
			this._setTabFocus(newFocusIndex);
		});
	}

	/** Sends any changes that could affect the layout of the items. */
	private _itemsResized(): Observable<ResizeObserverEntry[]> {
		if (typeof ResizeObserver !== 'function') {
			return EMPTY;
		}

		return this.itemsChanges.pipe(
			startWith(this.items()),
			switchMap(
				(tabItems: ReadonlyArray<BrnPaginatedTabHeaderItem>) =>
					new Observable((observer: Observer<ResizeObserverEntry[]>) =>
						this._ngZone.runOutsideAngular(() => {
							const resizeObserver = new ResizeObserver((entries) => observer.next(entries));
							for (const tabItem of tabItems) {
								resizeObserver.observe(tabItem.elementRef.nativeElement);
							}
							return () => {
								resizeObserver.disconnect();
							};
						}),
					),
			),
			// Skip the first emit since the resize observer emits when an item
			// is observed for new items when the tab is already inserted
			skip(1),
			// Skip emissions where all the elements are invisible since we don't want
			// the header to try and re-render with invalid measurements. See #25574.
			filter((entries) => entries.some((e) => e.contentRect.width > 0 && e.contentRect.height > 0)),
		);
	}

	ngAfterContentChecked(): void {
		// If the number of tab labels have changed, check if scrolling should be enabled
		if (this._tabLabelCount !== this.items().length) {
			this.updatePagination();
			this._tabLabelCount = this.items().length;
			this._changeDetectorRef.markForCheck();
		}

		// If the selected index has changed, scroll to the label and check if the scrolling controls
		// should be disabled.
		if (this._selectedIndexChanged) {
			this._scrollToLabel(this._selectedIndex());
			this._checkScrollingControls();
			this._selectedIndexChanged = false;
			this._changeDetectorRef.markForCheck();
		}

		// If the scroll distance has been changed (tab selected, focused, scroll controls activated),
		// then translate the header to reflect this.
		if (this._scrollDistanceChanged) {
			this._updateTabScrollPosition();
			this._scrollDistanceChanged = false;
			this._changeDetectorRef.markForCheck();
		}
	}

	ngOnDestroy() {
		this._keyManager?.destroy();
		this._destroyed.next();
		this._destroyed.complete();
		this._stopScrolling.complete();
	}

	/** Handles keyboard events on the header. */
	_handleKeydown(event: KeyboardEvent) {
		// We don't handle any key bindings with a modifier key.
		if (hasModifierKey(event)) {
			return;
		}

		switch (event.keyCode) {
			case ENTER:
			case SPACE:
				if (this.focusIndex !== this._selectedIndex()) {
					const item = this.items()[this.focusIndex];

					if (item && !item.disabled) {
						this.selectFocusedIndex.emit(this.focusIndex);
						this._itemSelected(event);
					}
				}
				break;
			default:
				this._keyManager.onKeydown(event);
		}
	}

	/**
	 * Callback for when the MutationObserver detects that the content has changed.
	 */
	_onContentChanges() {
		const textContent = this._elementRef.nativeElement.textContent;

		// We need to diff the text content of the header, because the MutationObserver callback
		// will fire even if the text content didn't change which is inefficient and is prone
		// to infinite loops if a poorly constructed expression is passed in (see #14249).
		if (textContent !== this._currentTextContent) {
			this._currentTextContent = textContent || '';

			// The content observer runs outside the `NgZone` by default, which
			// means that we need to bring the callback back in ourselves.
			this._ngZone.run(() => {
				this.updatePagination();
				this._changeDetectorRef.markForCheck();
			});
		}
	}

	/**
	 * Updates the view whether pagination should be enabled or not.
	 *
	 * WARNING: Calling this method can be very costly in terms of performance. It should be called
	 * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
	 * page.
	 */
	updatePagination() {
		this._checkPaginationEnabled();
		this._checkScrollingControls();
		this._updateTabScrollPosition();
	}

	/** Tracks which element has focus; used for keyboard navigation */
	public get focusIndex(): number {
		return this._keyManager ? (this._keyManager.activeItemIndex ?? 0) : 0;
	}

	/** When the focus index is set, we must manually send focus to the correct label */
	public set focusIndex(value: number) {
		if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
			return;
		}

		this._keyManager.setActiveItem(value);
	}

	/**
	 * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
	 * providing a valid index and return true.
	 */
	_isValidIndex(index: number): boolean {
		return this.items() ? !!this.items()[index] : true;
	}

	/**
	 * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
	 * scrolling is enabled.
	 */
	_setTabFocus(tabIndex: number) {
		if (this.showPaginationControls()) {
			this._scrollToLabel(tabIndex);
		}

		if (this.items()?.length) {
			this.items()[tabIndex].focus();

			// Do not let the browser manage scrolling to focus the element, this will be handled
			// by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
			// should be the full width minus the offset width.
			const containerEl = this.tabListContainer().nativeElement;
			const dir = this._getLayoutDirection();

			if (dir === 'ltr') {
				containerEl.scrollLeft = 0;
			} else {
				containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
			}
		}
	}

	/** The layout direction of the containing app. */
	_getLayoutDirection(): Direction {
		return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
	}

	/** Performs the CSS transformation on the tab list that will cause the list to scroll. */
	_updateTabScrollPosition() {
		if (this.disablePagination()) {
			return;
		}

		const scrollDistance = this.scrollDistance;
		const translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;

		// Don't use `translate3d` here because we don't want to create a new layer. A new layer
		// seems to cause flickering and overflow in Internet Explorer. For example, the ink bar
		// and ripples will exceed the boundaries of the visible tab bar.
		// See: https://github.com/angular/components/issues/10276
		// We round the `transform` here, because transforms with sub-pixel precision cause some
		// browsers to blur the content of the element.
		this.tabList().nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;

		// Setting the `transform` on IE will change the scroll offset of the parent, causing the
		// position to be thrown off in some cases. We have to reset it ourselves to ensure that
		// it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
		// with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
		if (this._platform.TRIDENT || this._platform.EDGE) {
			this.tabListContainer().nativeElement.scrollLeft = 0;
		}
	}

	/** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
	public get scrollDistance(): number {
		return this._scrollDistance;
	}
	public set scrollDistance(value: number) {
		this._scrollTo(value);
	}

	/**
	 * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
	 * the end of the list, respectively). The distance to scroll is computed to be a third of the
	 * length of the tab list view window.
	 *
	 * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
	 * should be called sparingly.
	 */
	_scrollHeader(direction: ScrollDirection) {
		const viewLength = this.tabListContainer().nativeElement.offsetWidth;

		// Move the scroll distance one-third the length of the tab list's viewport.
		const scrollAmount = ((direction === 'before' ? -1 : 1) * viewLength) / 3;

		return this._scrollTo(this._scrollDistance + scrollAmount);
	}

	/** Handles click events on the pagination arrows. */
	_handlePaginatorClick(direction: ScrollDirection) {
		this._stopInterval();
		this._scrollHeader(direction);
	}

	/**
	 * Moves the tab list such that the desired tab label (marked by index) is moved into view.
	 *
	 * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
	 * should be called sparingly.
	 */
	_scrollToLabel(labelIndex: number) {
		if (this.disablePagination()) {
			return;
		}

		const selectedLabel = this.items() ? this.items()[labelIndex] : null;

		if (!selectedLabel) {
			return;
		}

		// The view length is the visible width of the tab labels.
		const viewLength = this.tabListContainer().nativeElement.offsetWidth;
		const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;

		let labelBeforePos: number;
		let labelAfterPos: number;
		if (this._getLayoutDirection() === 'ltr') {
			labelBeforePos = offsetLeft;
			labelAfterPos = labelBeforePos + offsetWidth;
		} else {
			labelAfterPos = this.tabListInner().nativeElement.offsetWidth - offsetLeft;
			labelBeforePos = labelAfterPos - offsetWidth;
		}

		const beforeVisiblePos = this.scrollDistance;
		const afterVisiblePos = this.scrollDistance + viewLength;

		if (labelBeforePos < beforeVisiblePos) {
			// Scroll header to move label to the before direction
			this.scrollDistance -= beforeVisiblePos - labelBeforePos;
		} else if (labelAfterPos > afterVisiblePos) {
			// Scroll header to move label to the after direction
			this.scrollDistance += Math.min(labelAfterPos - afterVisiblePos, labelBeforePos - beforeVisiblePos);
		}
	}

	/**
	 * Evaluate whether the pagination controls should be displayed. If the scroll width of the
	 * tab list is wider than the size of the header container, then the pagination controls should
	 * be shown.
	 *
	 * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
	 * should be called sparingly.
	 */
	_checkPaginationEnabled() {
		if (this.disablePagination()) {
			this.showPaginationControls.set(false);
		} else {
			const isEnabled = this.tabListInner().nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;

			if (!isEnabled) {
				this.scrollDistance = 0;
			}

			if (isEnabled !== this.showPaginationControls()) {
				this._changeDetectorRef.markForCheck();
			}

			this.showPaginationControls.set(isEnabled);
		}
	}

	/**
	 * Evaluate whether the before and after controls should be enabled or disabled.
	 * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
	 * before button. If the header is at the end of the list (scroll distance is equal to the
	 * maximum distance we can scroll), then disable the after button.
	 *
	 * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
	 * should be called sparingly.
	 */
	_checkScrollingControls() {
		if (this.disablePagination()) {
			this.disableScrollAfter = this.disableScrollBefore = true;
		} else {
			// Check if the pagination arrows should be activated.
			this.disableScrollBefore = this.scrollDistance === 0;
			this.disableScrollAfter = this.scrollDistance === this._getMaxScrollDistance();
			this._changeDetectorRef.markForCheck();
		}
	}

	/**
	 * Determines what is the maximum length in pixels that can be set for the scroll distance. This
	 * is equal to the difference in width between the tab list container and tab header container.
	 *
	 * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
	 * should be called sparingly.
	 */
	_getMaxScrollDistance(): number {
		const lengthOfTabList = this.tabListInner().nativeElement.scrollWidth;
		const viewLength = this.tabListContainer().nativeElement.offsetWidth;
		return lengthOfTabList - viewLength || 0;
	}

	/** Stops the currently-running paginator interval.  */
	_stopInterval() {
		this._stopScrolling.next();
	}

	/**
	 * Handles the user pressing down on one of the paginators.
	 * Starts scrolling the header after a certain amount of time.
	 * @param direction In which direction the paginator should be scrolled.
	 */
	_handlePaginatorPress(direction: ScrollDirection, mouseEvent?: MouseEvent) {
		// Don't start auto scrolling for right mouse button clicks. Note that we shouldn't have to
		// null check the `button`, but we do it so we don't break tests that use fake events.
		if (mouseEvent && mouseEvent.button !== null && mouseEvent.button !== 0) {
			return;
		}

		// Avoid overlapping timers.
		this._stopInterval();

		// Start a timer after the delay and keep firing based on the interval.
		timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
			// Keep the timer going until something tells it to stop or the component is destroyed.
			.pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
			.subscribe(() => {
				const { maxScrollDistance, distance } = this._scrollHeader(direction);

				// Stop the timer if we've reached the start or the end.
				if (distance === 0 || distance >= maxScrollDistance) {
					this._stopInterval();
				}
			});
	}

	/**
	 * Scrolls the header to a given position.
	 * @param position Position to which to scroll.
	 * @returns Information on the current scroll distance and the maximum.
	 */
	private _scrollTo(position: number) {
		if (this.disablePagination()) {
			return { maxScrollDistance: 0, distance: 0 };
		}

		const maxScrollDistance = this._getMaxScrollDistance();
		this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));

		// Mark that the scroll distance has changed so that after the view is checked, the CSS
		// transformation can move the header.
		this._scrollDistanceChanged = true;
		this._checkScrollingControls();

		return { maxScrollDistance, distance: this._scrollDistance };
	}
}
