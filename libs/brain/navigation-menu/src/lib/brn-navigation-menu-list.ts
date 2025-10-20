import { computed, Directive } from '@angular/core';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'ul[brnNavigationMenuList]',
	host: {
		'[attr.data-orientation]': 'orientation()',
	},
})
export class BrnNavigationMenuList {
	private readonly _navigationMenu = injectBrnNavigationMenu();

	protected readonly orientation = computed(() => this._navigationMenu.context().orientation);
}
