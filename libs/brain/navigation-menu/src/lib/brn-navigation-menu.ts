import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
	selector: 'brn-navigation-menu',
	host: {
		'[attr.data-orientation]': 'orientation()',
	},
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnNavigationMenu {
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
	 * If omitted, inherits globally from Directionality or assumes LTR (left-to-right) reading mode.
	 */
	public readonly dir = input<'ltr' | 'rtl'>();

	/**
	 * The orientation of the menu.
	 */
	public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
