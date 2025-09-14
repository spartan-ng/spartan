import { Directive } from '@angular/core';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: '[brn-navigation-menu-list]',
	host: {
		'[attr.data-orientation]': '_orientation()',
	},
})
export class BrnNavigationMenuList {
	private readonly _navigationMenu = injectBrnNavigationMenu();

	private readonly _orientation = this._navigationMenu.context().orientation;
}
