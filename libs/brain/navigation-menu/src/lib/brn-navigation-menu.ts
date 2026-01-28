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
import { toObservable } from '@angular/core/rxjs-interop';
import { computedPrevious, createHoverObservable } from '@spartan-ng/brain/core';
import { BehaviorSubject, combineLatest, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, filter, map, pairwise, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
		'[attr.dir]': 'direction()',
		'aria-label': 'Main',
		'data-slot': 'navigation-menu',
	},
})
export class BrnNavigationMenu implements OnDestroy {
	private readonly _dir = inject(Directionality);
	private readonly _zone = inject(NgZone);
	private readonly _destroy$ = new Subject<void>();
	private readonly _anyTriggerHovered$ = new BehaviorSubject<boolean>(false);

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
	 * Controls whether the menu opens on hover or click.
	 * When 'click', initial open requires a click, but hover still switches between items once open.
	 */
	public readonly openOn = input<'hover' | 'click'>('hover');

	/** internal **/
	public readonly direction = this._dir.valueSignal;

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
			.withHorizontalOrientation(this.direction())
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

	public readonly context = computed(() => ({ orientation: this.orientation(), dir: this.direction() }));

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

		combineLatest([this._hovered$, this._contentHovered$, this._anyTriggerHovered$])
			.pipe(
				debounceTime(0),
				filter(([hovered, contentHovered]) => !(hovered === undefined && contentHovered === undefined)),
				switchMap(([hovered, contentHovered, triggerHovered]) => {
					const shouldClose = !hovered && !contentHovered && !triggerHovered;
					// Add delay before closing in click mode to allow for sibling hover transitions
					if (shouldClose && this.openOn() === 'click') {
						return of([hovered, contentHovered, triggerHovered] as const).pipe(delay(150));
					}
					return of([hovered, contentHovered, triggerHovered] as const);
				}),
				takeUntil(this._destroy$),
			)
			.subscribe(([hovered, contentHovered, triggerHovered]) => {
				if (!hovered && !contentHovered && !triggerHovered) {
					this.value.set(undefined);
				}
			});
	}

	/**
	 * Called by triggers to report their hover state for coordination.
	 * @internal
	 */
	public setTriggerHovered(hovered: boolean) {
		this._anyTriggerHovered$.next(hovered);
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
