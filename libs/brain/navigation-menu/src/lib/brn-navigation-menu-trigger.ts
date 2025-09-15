import { Directive } from '@angular/core';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: '[brn-navigation-menu-trigger]',
	host: {
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
	},
})
export class BrnNavigationMenuTrigger {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();

	protected onClick() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	protected activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}
}
