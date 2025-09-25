import { Directionality } from '@angular/cdk/bidi';
import { computed, Directive, inject, input, model } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, of, startWith } from 'rxjs';
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
export class BrnNavigationMenu {
	private readonly _directionality = inject(Directionality);

	/**
	 * The value of the menu item that should be active when initially rendered.
	 * Use when you do not need to control the value state.
	 */
	public readonly defaultValue = input<string>();

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
}
