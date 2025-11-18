import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import {
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	NgZone,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BrnButton } from '@spartan-ng/brain/button';
import { createHoverObservable, isElement } from '@spartan-ng/brain/core';
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
		'(focus)': 'handleFocus()',
		'[id]': '_id',
		'[attr.data-state]': '_state()',
		'[attr.aria-expanded]': '_isActive()',
		'[attr.aria-controls]': '_contentId',
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

	protected readonly _id = `brn-navigation-menu-trigger-${++BrnNavigationMenuTrigger._id}`;

	private readonly _parentNavMenu = this._navigationMenu.parentNavMenu;

	protected readonly _isActive = this._navigationMenuItem.isActive;

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
		// Hover event is NOT allowed when a sub-navigation is currently visible, AND the current hover event is false.
		filter((e) => !(this._isSubNavVisible() && !e.hover)),
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
		this._contentService.setConfig({ attachTo: this._el, direction: this._dir(), orientation: this._orientation() });
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

	protected onTab(e: KeyboardEvent) {
		const contentEl = this._contentService.contentEl();

		if (contentEl && !hasModifierKey(e)) {
			e.preventDefault();
			contentEl.focus();
		}
	}

	protected onEscape(e: KeyboardEvent) {
		e.preventDefault();
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
