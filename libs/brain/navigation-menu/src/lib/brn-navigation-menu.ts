import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
	computed,
	contentChildren,
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	model,
	NgZone,
	OnDestroy,
	signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { createHoverObservable } from '@spartan-ng/brain/core';
import { computedPrevious } from '@spartan-ng/brain/tooltip';
import { combineLatest, debounceTime, map, merge, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { BrnNavigationMenuItem } from './brn-navigation-menu-item';
import { provideBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'nav[brnNavigationMenu]',
	host: {
		'[attr.aria-label]': '"Main"',
		'[attr.data-orientation]': 'orientation()',
		'[attr.dir]': '_dir()',
	},
	providers: [provideBrnNavigationMenu(BrnNavigationMenu)],
})
export class BrnNavigationMenu implements OnDestroy {
	private readonly _directionality = inject(Directionality);
	private readonly _el = inject(ElementRef);
	private readonly _focusMonitor = inject(FocusMonitor);
	private readonly _zone = inject(NgZone);
	private readonly _destroy$ = new Subject<void>();

	/**
	 * The controlled value of the menu item to activate.
	 */
	public readonly value = model<string>();

	/**
	 * The duration from when the mouse enters a trigger until the content opens.
	 */
	public readonly delayDuration = input<number>(200);

	/**
	 * How much time a user has to enter another trigger without incurring a delay again.
	 */
	public readonly skipDelayDuration = input<number>(300);

	/**
	 * The reading direction of the menu when applicable.
	 */
	public readonly dir = input<'ltr' | 'rtl'>();

	/**
	 * The orientation of the menu.
	 */
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

	public readonly isOpenDelayed = signal(true);

	private _skipDelayTimerRef: NodeJS.Timeout | number = 0;

	private readonly _menuItems = contentChildren(BrnNavigationMenuItem, { descendants: true });

	public readonly menuItemsIds = computed(() => this._menuItems().map((mi) => mi.id()));

	public readonly focused$ = this._focusMonitor.monitor(this._el).pipe(map((e) => e !== null));

	private readonly _hovered$ = merge(
		createHoverObservable(this._el.nativeElement, this._zone, this._destroy$),
		this.focused$,
	);

	private readonly _contentHovered$ = toObservable(this._menuItems).pipe(
		switchMap((menuItems) => merge(...menuItems.map((mi) => mi.contentHovered$))),
	);

	public readonly previousValue = computedPrevious(this.value);

	private readonly _dir$ = toObservable(this.dir);

	/**
	 * The reading direction of the menu when applicable.
	 * If input is not passed, inherits globally from Directionality or assumes LTR (left-to-right) reading mode.
	 */
	protected readonly _dir = toSignal(
		combineLatest([
			this._dir$.pipe(startWith(undefined)),
			this._directionality.change.pipe(startWith(undefined)),
			of('ltr' as const),
		]).pipe(map(([dir, dirChange, fallback]) => dir ?? dirChange ?? fallback)),
	);

	public readonly context = computed(() => ({ orientation: this.orientation() }));

	constructor() {
		effect(() => {
			const isOpen = this.value() !== undefined;
			const hasSkipDelayDuration = this.skipDelayDuration() > 0;

			if (isOpen) {
				clearTimeout(this._skipDelayTimerRef);
				if (hasSkipDelayDuration) this.isOpenDelayed.set(false);
			} else {
				clearTimeout(this._skipDelayTimerRef);
				this._skipDelayTimerRef = setTimeout(() => {
					this.isOpenDelayed.set(true);
				}, this.skipDelayDuration());
			}
		});

		combineLatest([this._hovered$, this._contentHovered$])
			.pipe(debounceTime(0), takeUntil(this._destroy$))
			.subscribe(([hovered, contentHovered]) => {
				if (!hovered && !contentHovered) this.value.set(undefined);
			});
	}

	ngOnDestroy() {
		this._destroy$.next();
		this._destroy$.complete();
	}
}
