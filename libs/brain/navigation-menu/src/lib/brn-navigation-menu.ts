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
import {
	combineLatest,
	debounceTime,
	filter,
	map,
	merge,
	of,
	pairwise,
	startWith,
	Subject,
	switchMap,
	takeUntil,
} from 'rxjs';
import { BrnNavigationMenuItem } from './brn-navigation-menu-item';
import { provideBrnNavigationMenu } from './brn-navigation-menu.token';
import { injectBrnParentNavMenu } from './brn-parent-nav-menu.token';

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
	private readonly _zone = inject(NgZone);
	private readonly _destroy$ = new Subject<void>();

	public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
	public readonly parentNavMenu = injectBrnParentNavMenu();

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

	private readonly _navAndSubnavMenuItems = contentChildren(BrnNavigationMenuItem, { descendants: true });

	public readonly menuItems = computed(() => this._navAndSubnavMenuItems().filter((mi) => mi.navMenuElRef === this.el));

	private readonly _reset$ = toObservable(this.value).pipe(
		pairwise(),
		filter(([prev, curr]) => curr === undefined && curr !== prev),
		map(() => undefined),
	);

	private readonly _hovered$ = merge(
		createHoverObservable(this.el.nativeElement, this._zone, this._destroy$).pipe(map((e) => e.hover)),
		this._reset$,
	).pipe(startWith(undefined));

	private readonly _contentHovered$ = merge(
		toObservable(this._navAndSubnavMenuItems).pipe(
			switchMap((menuItems) => merge(...menuItems.map((mi) => mi.contentHovered$))),
		),
		this._reset$,
	).pipe(startWith(undefined));

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
		{ requireSync: true },
	);

	public readonly context = computed(() => ({ orientation: this.orientation(), dir: this._dir() }));

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
			.pipe(
				debounceTime(0),
				filter(([hovered, contentHovered]) => !(hovered === undefined && contentHovered === undefined)),
				takeUntil(this._destroy$),
			)
			.subscribe(([hovered, contentHovered]) => {
				if (!hovered && !contentHovered) {
					this.value.set(undefined);
				}
			});
	}

	ngOnDestroy() {
		this._destroy$.next();
		this._destroy$.complete();
	}
}
