import { hasModifierKey } from '@angular/cdk/keycodes';
import {
	computed,
	Directive,
	effect,
	ElementRef,
	inject,
	NgZone,
	OnDestroy,
	OnInit,
	untracked,
	ViewContainerRef,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BrnButton } from '@spartan-ng/brain/button';
import { areSiblings, createHoverObservableWithData, isElement } from '@spartan-ng/brain/core';
import {
	debounceTime,
	delay,
	distinctUntilChanged,
	filter,
	fromEvent,
	map,
	merge,
	Observable,
	of,
	share,
	Subject,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs';
import { BrnNavigationMenuContentService } from './brn-navigation-menu-content.service';
import { provideBrnNavigationMenuInteractable } from './brn-navigation-menu-item-interactable.token';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

interface TriggerEvent {
	type: 'click' | 'hover' | 'set';
	visible: boolean;
	relatedTarget?: EventTarget | null;
}

@Directive({
	selector: 'button[brnNavigationMenuTrigger]',
	host: {
		'(keydown.escape)': 'onEscape($event)',
		'(keydown.tab)': 'onTab($event)',
		'[attr.data-state]': 'state()',
	},
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
	providers: [provideBrnNavigationMenuInteractable(BrnNavigationMenuTrigger)],
})
export class BrnNavigationMenuTrigger implements OnInit, OnDestroy {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _destroy$ = new Subject<void>();
	private readonly _vcr = inject(ViewContainerRef);
	private readonly _zone = inject(NgZone);
	private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _contentService = inject(BrnNavigationMenuContentService);

	private readonly _parentNavMenu = this._navigationMenu.parentNavMenu;

	protected readonly state = this._navigationMenuItem.state;

	private readonly _dir = computed(() => this._navigationMenu.context().dir);

	private readonly _orientation = computed(() => this._navigationMenu.context().orientation);

	private readonly _isOpenDelayed = this._navigationMenu.isOpenDelayed;

	private readonly _delayDuration = this._navigationMenu.delayDuration;

	private readonly _contentTemplate = this._navigationMenuItem.contentTemplate;

	private readonly _isSubNavHovered = toSignal(this._navigationMenuItem.subNavHover$.pipe(switchMap((c) => c)), {
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
		createHoverObservableWithData(this._el.nativeElement, this._zone, this._destroy$),
		this._contentService.hovered$.pipe(map((value) => ({ hover: value, relatedTarget: null }))),
	).pipe(
		// Hover is NOT allowed when:
		// - this is a root navigation menu (no parent), AND
		// - a sub-navigation is currently hovered, AND
		// - the current hover event is false.
		filter((v) => !(!this._parentNavMenu && this._isSubNavHovered() && !v)),
		map((value) => ({ type: 'hover' as const, visible: value.hover, relatedTarget: value.relatedTarget })),
	);

	private readonly _showing$ = merge(this._isActive$, this._clicked$, this._hovered$).pipe(
		debounceTime(0),
		distinctUntilChanged((curr, prev) => curr.visible === prev.visible),
		switchMap((ev) => {
			const shouldDelay = ev.visible && ev.type !== 'click' && this._isOpenDelayed();
			return of(ev).pipe(delay(shouldDelay ? this._delayDuration() : 0));
		}),
		// Deactivate needs to be called if the menu item content is hidden with a user click.
		tap((ev) => (ev.visible ? this._activate() : ev.type === 'click' && this._deactivate())),
		// Deactivate if nav item is hovered out to a disabled sibling nav item
		tap((ev) => {
			if (
				!ev.visible &&
				ev.type == 'hover' &&
				isElement(ev.relatedTarget) &&
				areSiblings(this._navigationMenuItem.el.nativeElement, ev.relatedTarget) &&
				ev.relatedTarget.getAttribute('data-disabled') === 'true'
			) {
				this._deactivate();
			}
		}),
		share(),
		takeUntil(this._destroy$),
	);

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
				this._parentNavMenu.subNavHover$.next(ev.visible);
			}

			if (ev.visible) {
				this._contentService.show();
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

	private _activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	private _deactivate() {
		this._navigationMenu.value.set(undefined);
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
}
