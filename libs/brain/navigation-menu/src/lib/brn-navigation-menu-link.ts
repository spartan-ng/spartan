import { Directive } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { provideBrnNavigationMenuInteractable } from './brn-navigation-menu-item-interactable.token';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'a[brnNavigationMenuLink]',
	host: {
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
		'[attr.data-active]': 'isActive()',
	},
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
	providers: [provideBrnNavigationMenuInteractable(BrnNavigationMenuLink)],
})
export class BrnNavigationMenuLink {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();

	protected readonly isActive = this._navigationMenuItem.isActive;

	protected onClick() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	protected activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}
}
