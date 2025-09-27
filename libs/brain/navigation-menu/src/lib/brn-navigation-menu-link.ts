import { Directive } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'a[brnNavigationMenuLink]',
	host: {
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
		'[attr.data-state]': 'state()',
	},
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
})
export class BrnNavigationMenuTrigger {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();

	protected readonly state = this._navigationMenuItem.state;

	protected onClick() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	protected activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}
}
