import { computed, Directive } from '@angular/core';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'ul[brnNavigationMenuList]',
	host: {
		'[attr.data-orientation]': '_orientation()',
		'data-slot': 'navigation-menu-list',
	},
})
export class BrnNavigationMenuList {
	private readonly _navigationMenu = injectBrnNavigationMenu();

	protected readonly _orientation = computed(() => this._navigationMenu.context().orientation);
}
