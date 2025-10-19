import { FocusMonitor } from '@angular/cdk/a11y';
import {
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
import { toObservable } from '@angular/core/rxjs-interop';
import { BrnButton } from '@spartan-ng/brain/button';
import { createHoverObservable } from '@spartan-ng/brain/core';
import {
	debounceTime,
	delay,
	distinctUntilChanged,
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
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

interface TriggerEvent {
	type: 'click' | 'hover' | 'set';
	visible: boolean;
}

@Directive({
	selector: 'button[brnNavigationMenuTrigger]',
	host: {
		'[attr.data-state]': 'state()',
	},
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
})
export class BrnNavigationMenuTrigger implements OnInit, OnDestroy {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _destroy$ = new Subject<void>();
	private readonly _vcr = inject(ViewContainerRef);
	private readonly _zone = inject(NgZone);
	private readonly _el = inject(ElementRef);
	private readonly _contentService = inject(BrnNavigationMenuContentService);
	private readonly _focusMonitor = inject(FocusMonitor);

	protected readonly state = this._navigationMenuItem.state;

	private readonly _isOpenDelayed = this._navigationMenu.isOpenDelayed;

	private readonly _delayDuration = this._navigationMenu.delayDuration;

	private readonly _contentTemplate = this._navigationMenuItem.contentTemplate;

	public readonly focused$: Observable<boolean> = this._focusMonitor.monitor(this._el).pipe(map((e) => e !== null));

	private readonly _isActive$: Observable<TriggerEvent> = toObservable(this._navigationMenuItem.isActive).pipe(
		map((value) => ({ type: 'set', visible: value })),
	);

	private readonly _clicked$: Observable<TriggerEvent> = fromEvent(this._el.nativeElement, 'click').pipe(
		map(() => !this._navigationMenuItem.isActive()),
		map((value) => ({ type: 'click', visible: value })),
	);

	private readonly _hovered$: Observable<TriggerEvent> = merge(
		createHoverObservable(this._el.nativeElement, this._zone, this._destroy$),
		this._contentService.hovered$,
		this.focused$,
	).pipe(
		map((value) => ({ type: 'hover' as const, visible: value })),
		distinctUntilChanged((prev, curr) => prev.visible === curr.visible),
	);

	private readonly _showing$ = merge(this._isActive$, this._clicked$, this._hovered$).pipe(
		debounceTime(0),
		distinctUntilChanged((curr, prev) => curr.visible === prev.visible),
		switchMap((ev) => {
			const shouldDelay = ev.visible && ev.type !== 'click' && this._isOpenDelayed();
			return of(ev).pipe(delay(shouldDelay ? this._delayDuration() : 0));
		}),
		// Deactivate only needs to be called if the menu item content is hidden with a user click.
		tap((ev) => (ev.visible ? this._activate() : ev.type === 'click' && this._deactivate())),
		map((ev) => ev.visible),
		// switchMap((visible) => {
		// 	// don't do anything when we are in the process of showing the content
		// 	if (visible) return of(visible);
		// 	// we set the state to closed here to trigger any animations for the element leaving
		// 	// this._contentService.setState('closed');
		// 	// then delay to wait for the leaving animation to finish
		// 	return of(visible).pipe(delay(this.animationDelay()));
		// }),
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
	}

	public ngOnInit() {
		this._contentService.setConfig({ attachTo: this._el });
		this._showing$.subscribe((isShowing) => {
			if (isShowing) {
				this._contentService.show();
			} else {
				this._contentService.hide();
			}
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
}
