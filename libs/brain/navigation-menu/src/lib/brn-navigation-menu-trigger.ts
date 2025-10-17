import { FocusMonitor } from '@angular/cdk/a11y';
import { Directive, effect, ElementRef, inject, NgZone, untracked, ViewContainerRef } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BrnButton } from '@spartan-ng/brain/button';
import { createHoverObservable } from '@spartan-ng/brain/core';
import {
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
export class BrnNavigationMenuTrigger {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _destroy$ = new Subject<void>();
	private readonly _vcr = inject(ViewContainerRef);
	private readonly _zone = inject(NgZone);
	private readonly _el = inject(ElementRef);
	private readonly _contentService = inject(BrnNavigationMenuContentService);
	private readonly _focusMonitor = inject(FocusMonitor);

	protected readonly state = this._navigationMenuItem.state;

	private readonly _delayDuration = this._navigationMenu.delayDuration;

	private readonly _skipDelayDuration = this._navigationMenu.skipDelayDuration;

	private readonly _contentTemplate = this._navigationMenuItem.contentTemplate;

	public readonly focused$: Observable<boolean> = this._focusMonitor.monitor(this._el).pipe(map((e) => e !== null));

	private readonly _isActive$ = toObservable(this._navigationMenuItem.isActive);

	private readonly _clicked$ = fromEvent(this._el.nativeElement, 'click').pipe(
		map(() => !this._navigationMenuItem.isActive()),
	);

	private readonly _hovered$: Observable<boolean> = merge(
		createHoverObservable(this._el.nativeElement, this._zone, this._destroy$),
		this._contentService.hovered$,
		this.focused$,
	).pipe(distinctUntilChanged());

	private readonly _showing$: Observable<boolean> = merge(this._isActive$, this._clicked$, this._hovered$).pipe(
		// we set the state to open here because we are about to open show the content
		tap((visible) => visible && this.activate()),
		switchMap((visible) => {
			// we are delaying based on the configure-able input
			return of(visible).pipe(delay(visible ? this._delayDuration() : 0));
		}),
		// switchMap((visible) => {
		// 	// don't do anything when we are in the process of showing the content
		// 	if (visible) return of(visible);
		// 	// we set the state to closed here to trigger any animations for the element leaving
		// 	// this._contentService.setState('closed');
		// 	// then delay to wait for the leaving animation to finish
		// 	return of(visible).pipe(delay(this.animationDelay()));
		// }),
		distinctUntilChanged(),
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

	protected activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}
}
