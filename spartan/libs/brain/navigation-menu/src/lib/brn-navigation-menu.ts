import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
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
import { computedPrevious, createHoverObservable } from '@spartan-ng/brain/core';
import { combineLatest, merge, of, Subject } from 'rxjs';
import { debounceTime, filter, map, pairwise, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { BrnNavigationMenuItem } from './brn-navigation-menu-item';
import { BrnNavigationMenuLink } from './brn-navigation-menu-link';
import { provideBrnNavigationMenu } from './brn-navigation-menu.token';
import { injectBrnParentNavMenu } from './brn-parent-nav-menu.token';

function areArraysSameByElRef(arr1: unknown[], arr2: unknown[]) {
	if (arr1.length !== arr2.length) return false;
	return arr1.every((item, index) => item === arr2[index]);
}

@Directive({
	selector: 'nav[brnNavigationMenu]',
	providers: [provideBrnNavigationMenu(BrnNavigationMenu)],
	host: {
		'(keydown)': 'handleKeydown($event)',
		'[attr.data-orientation]': 'orientation()',
		'[attr.dir]': '_dir()',
		'aria-label': 'Main',
		'data-slot': 'navigation-menu',
	},
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

	private readonly _isOpenDelayed = signal(true);
	public readonly isOpenDelayed = this._isOpenDelayed.asReadonly();

	private _skipDelayTimerRef: ReturnType<typeof setTimeout> | undefined;

	private readonly _navAndSubnavMenuItems = contentChildren(BrnNavigationMenuItem, { descendants: true });

	public readonly menuItems = computed(
		() => this._navAndSubnavMenuItems().filter((mi) => mi.navMenuElRef === this.el),
		{
			equal: areArraysSameByElRef,
		},
	);

	public readonly menuItemIds = computed(() => this.menuItems().map((mi) => mi.id()));

	private readonly _triggersAndLinks = computed(() => this.menuItems().map((mi) => mi.focusable()));

	private readonly _linkMenuItems = computed(() =>
		this.menuItems().filter((i) => i.focusable() instanceof BrnNavigationMenuLink),
	);

	private readonly _keyManager = computed(() => {
		return new FocusKeyManager<FocusableOption>(this._triggersAndLinks())
			.withHorizontalOrientation(this._dir())
			.withHomeAndEnd()
			.withPageUpDown()
			.withWrap()
			.skipPredicate((e) => !!e.disabled);
	});

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
				if (hasSkipDelayDuration) this._isOpenDelayed.set(false);
			} else {
				clearTimeout(this._skipDelayTimerRef);
				this._skipDelayTimerRef = setTimeout(() => {
					this._isOpenDelayed.set(true);
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

	public isLink(id?: string): boolean {
		return !!this._linkMenuItems().find((item) => item.id() === id);
	}

	public setActiveItem(item: FocusableOption) {
		this._keyManager().setActiveItem(item);
	}

	protected handleKeydown(event: KeyboardEvent) {
		this._keyManager().onKeydown(event);
	}

	ngOnDestroy() {
		this._destroy$.next();
		this._destroy$.complete();
		clearTimeout(this._skipDelayTimerRef);
	}
}
