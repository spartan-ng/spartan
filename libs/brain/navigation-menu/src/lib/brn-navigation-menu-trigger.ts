import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import {
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	NgZone,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BrnButton } from '@spartan-ng/brain/button';
import { createHoverObservable, isElement, type MenuAlign } from '@spartan-ng/brain/core';
import { fromEvent, merge, Observable, of, Subject } from 'rxjs';
import {
	debounceTime,
	delay,
	distinctUntilChanged,
	filter,
	map,
	share,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs/operators';
import { BrnNavigationMenuContentService } from './brn-navigation-menu-content.service';
import { BrnNavigationMenuItem } from './brn-navigation-menu-item';
import { provideBrnNavigationMenuFocusable } from './brn-navigation-menu-item-focusable.token';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { focusFirst, getTabbableCandidates } from './brn-navigation-menu-tabbable';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

interface TriggerEvent {
	type: 'click' | 'hover' | 'set';
	visible: boolean;
	relatedTarget?: EventTarget | null;
}

@Directive({
	selector: 'button[brnNavigationMenuTrigger]',
	providers: [provideBrnNavigationMenuFocusable(BrnNavigationMenuTrigger)],
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
	host: {
		'(keydown.escape)': 'onEscape($event)',
		'(keydown.tab)': 'onTab($event)',
		'(keydown.arrowDown)': 'onEntryKey($event, "horizontal")',
		'(keydown.arrowRight)': 'onEntryKey($event, "vertical", "ltr")',
		'(keydown.arrowLeft)': 'onEntryKey($event, "vertical", "rtl")',
		'(focus)': 'handleFocus()',
		'[id]': '_id',
		'[attr.data-state]': '_state()',
		'[attr.aria-expanded]': '_isActive()',
		'[attr.aria-controls]': '_ariaControls()',
		'data-slot': 'navigation-menu-trigger',
	},
})
export class BrnNavigationMenuTrigger implements OnInit, OnDestroy, FocusableOption {
	private static _id = 0;

	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _destroy$ = new Subject<void>();
	private readonly _vcr = inject(ViewContainerRef);
	private readonly _zone = inject(NgZone);
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _contentService = inject(BrnNavigationMenuContentService);

	public readonly align = input<MenuAlign>('start');

	protected readonly _id = `brn-navigation-menu-trigger-${++BrnNavigationMenuTrigger._id}`;

	private readonly _parentNavMenu = this._navigationMenu.parentNavMenu;

	protected readonly _isActive = this._navigationMenuItem.isActive;

	// Only reference the content panel while it is open, matching Radix's aria-controls behaviour.
	protected readonly _ariaControls = computed(() => (this._isActive() ? this._contentId : null));

	protected readonly _contentId = this._contentService.id;

	protected readonly _state = this._navigationMenuItem.state;

	private readonly _dir = computed(() => this._navigationMenu.context().dir);

	private readonly _orientation = computed(() => this._navigationMenu.context().orientation);

	private readonly _isOpenDelayed = this._navigationMenu.isOpenDelayed;

	private readonly _delayDuration = this._navigationMenu.delayDuration;

	private readonly _contentTemplate = this._navigationMenuItem.contentTemplate;

	private readonly _isSubNavVisible = toSignal(this._navigationMenuItem.subNavVisible$.pipe(switchMap((c) => c)), {
		initialValue: false,
	});

	private readonly _isActive$: Observable<TriggerEvent> = toObservable(this._navigationMenuItem.isActive).pipe(
		map((value) => ({ type: 'set', visible: value })),
	);

	private readonly _clicked$: Observable<TriggerEvent> = fromEvent(this._el.nativeElement, 'click').pipe(
		map(() => !this._navigationMenuItem.isActive()),
		map((value) => ({ type: 'click', visible: value })),
	);

	private readonly _hovered$: Observable<TriggerEvent> = merge(
		createHoverObservable(this._el.nativeElement, this._zone, this._destroy$),
		this._contentService.hovered$.pipe(map((v) => ({ hover: v, relatedTarget: null }))),
	).pipe(
		// Report hover state to parent for coordination
		tap((e) => this._navigationMenu.setTriggerHovered(e.hover)),
		// Hover event is NOT allowed when a sub-navigation is currently visible, AND the current hover event is false.
		filter((e) => !(this._isSubNavVisible() && !e.hover)),
		// Block hover-open when openOn='click' and no menu is currently open
		filter((e) => {
			const openOn = this._navigationMenu.openOn();
			const isMenuOpen = this._navigationMenu.value() !== undefined;
			// Allow if: openOn is 'hover', OR menu is already open, OR this is hover-out
			return openOn === 'hover' || isMenuOpen || !e.hover;
		}),
		// Add stabilization delay for hover-out in click mode to prevent race conditions
		switchMap((e) => {
			if (!e.hover && this._navigationMenu.openOn() === 'click') {
				return of(e).pipe(delay(50));
			}
			return of(e);
		}),
		map((e) => ({ type: 'hover' as const, visible: e.hover, relatedTarget: e.relatedTarget })),
	);

	private readonly _showing$ = merge(this._isActive$, this._clicked$, this._hovered$).pipe(
		debounceTime(0),
		distinctUntilChanged((prev, curr) => prev.visible === curr.visible),
		switchMap((ev) => {
			const shouldDelay = ev.visible && ev.type !== 'click' && this._isOpenDelayed();
			return of(ev).pipe(delay(shouldDelay ? this._delayDuration() : 0));
		}),
		// Deactivate needs to be called if the menu item content is hidden with a user click OR
		// If nav item is hovered out to a disabled sibling nav item
		tap((ev) => {
			if (ev.visible) {
				this._activate();
			} else {
				const shouldDeactivate =
					(ev.type === 'click' || !this._isHoverOnSibling(ev)) && this._navigationMenuItem.isActive();

				if (shouldDeactivate) {
					this._deactivate();
				}
			}
		}),
		share(),
		takeUntil(this._destroy$),
	);

	public get disabled() {
		return this._navigationMenuItem.disabled();
	}

	constructor() {
		effect(() => {
			const value = this._contentTemplate();
			untracked(() => {
				if (value) {
					this._contentService.setContent(value, this._vcr);
				}
			});
		});

		effect(() => {
			const align = this.align();
			untracked(() => {
				this._contentService.updateAlign(align);
			});
		});

		effect(() => {
			const orientation = this._orientation();
			untracked(() => {
				this._contentService.updateOrientation(orientation);
			});
		});

		effect(() => {
			const dir = this._dir();
			untracked(() => {
				this._contentService.updateDirection(dir);
			});
		});
	}

	public ngOnInit() {
		this._contentService.setConfig({
			attachTo: this._el,
			direction: this._dir(),
			orientation: this._orientation(),
			align: this.align(),
		});
		this._showing$.pipe(takeUntil(this._destroy$)).subscribe((ev) => {
			if (this._parentNavMenu) {
				this._parentNavMenu.subNavVisible$.next(ev.visible);
			}

			if (ev.visible) {
				if (this._isBrowser) {
					this._contentService.show();
				}
			} else {
				this._contentService.hide();
			}
		});

		this._contentService.escapePressed$.pipe(takeUntil(this._destroy$)).subscribe((e) => {
			e.preventDefault();
			this._el.nativeElement.focus();
			this._deactivate();
		});

		this._contentService.tabPressed$.pipe(takeUntil(this._destroy$)).subscribe((e) => this._handleContentTab(e));
	}

	public ngOnDestroy() {
		this._destroy$.next();
		this._destroy$.complete();
	}

	public focus(_origin?: FocusOrigin) {
		if (this._navigationMenuItem.disabled()) return;

		this._el.nativeElement.focus();
	}

	protected handleFocus() {
		this._navigationMenu.setActiveItem(this);
	}

	protected onTab(e: Event) {
		const contentEl = this._contentService.contentEl();

		if (contentEl && !hasModifierKey(e as KeyboardEvent)) {
			e.preventDefault();
			this._focusFirstContent();
		}
	}

	/** Arrow-key entry into the open content: ArrowDown (horizontal) or ArrowRight/Left (vertical, dir-aware). */
	protected onEntryKey(e: Event, orientation: 'horizontal' | 'vertical', dir?: 'ltr' | 'rtl') {
		if (!this._navigationMenuItem.isActive()) return;
		if (this._orientation() !== orientation) return;
		if (orientation === 'vertical' && dir && this._dir() !== dir) return;

		e.preventDefault();
		this._focusFirstContent();
	}

	protected onEscape(e: Event) {
		e.preventDefault();
		this._deactivate();
	}

	private _focusFirstContent() {
		const contentEl = this._contentService.contentEl();
		if (!contentEl) return;

		const candidates = getTabbableCandidates(contentEl);
		if (candidates.length) {
			focusFirst(candidates);
		} else {
			contentEl.focus();
		}
	}

	/** Keeps keyboard focus inside the menu when tabbing across the content edges (issue #1484). */
	private _handleContentTab(event: KeyboardEvent) {
		const contentEl = this._contentService.contentEl();
		if (!contentEl) return;

		const candidates = getTabbableCandidates(contentEl);
		const focused = document.activeElement as HTMLElement | null;
		const index = focused ? candidates.indexOf(focused) : -1;

		if (event.shiftKey) {
			const previous = index > 0 ? candidates.slice(0, index).reverse() : [];
			if (previous.length && focusFirst(previous)) {
				event.preventDefault();
				return;
			}
			// at the first item or on the content container - return to the trigger, keep content open
			event.preventDefault();
			this._el.nativeElement.focus();
			return;
		}

		const next = index >= 0 ? candidates.slice(index + 1) : candidates;
		if (next.length && focusFirst(next)) {
			event.preventDefault();
			return;
		}

		// past the last item - hand focus to the next top-level item and close the panel
		if (this._navigationMenu.focusSibling(this, 1)) {
			event.preventDefault();
		}
		this._deactivate();
	}

	private _activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	private _deactivate() {
		this._navigationMenu.value.set(undefined);
	}

	private _isHoverOnSibling(ev: TriggerEvent): boolean {
		if (ev.type !== 'hover' || !isElement(ev.relatedTarget)) return false;

		const menuItem = this._isMenuItemOrChild(ev.relatedTarget);

		return !!menuItem && !menuItem.disabled();
	}

	private _isMenuItemOrChild(node: Node): BrnNavigationMenuItem | undefined {
		return this._navigationMenu
			.menuItems()
			.find((ref) => ref.el.nativeElement === node || ref.el.nativeElement.contains(node));
	}
}
