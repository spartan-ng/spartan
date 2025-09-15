import { computed, Directive, input } from '@angular/core';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: '[brn-navigation-menu-item]',
	host: {
		'[id]': 'id()',
	},
})
export class BrnNavigationMenuItem {
	private static _id = 0;

	private readonly _navigationMenu = injectBrnNavigationMenu();

	/** The id of the navigation menu item */
	public readonly id = input<string>(`brn-navigation-menu-item-${++BrnNavigationMenuItem._id}`);

	public readonly isActive = computed(() => this.id() === this._navigationMenu.value());
}
