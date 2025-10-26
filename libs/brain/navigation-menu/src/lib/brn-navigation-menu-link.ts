import { FocusableOption, FocusOrigin } from '@angular/cdk/a11y';
import { Directive, ElementRef, inject } from '@angular/core';
import { BrnButton } from '@spartan-ng/brain/button';
import { provideBrnNavigationMenuFocusable } from './brn-navigation-menu-item-focusable.token';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'a[brnNavigationMenuLink]',
	host: {
		'(click)': 'onClick()',
		'(mouseenter)': 'activate()',
		'(focus)': 'handleFocus()',
		'[attr.data-active]': '_isActive() ? "" : undefined',
		'[attr.aria-current]': '_isActive() ? "page" : undefined',
	},
	hostDirectives: [
		{
			directive: BrnButton,
			inputs: ['disabled'],
		},
	],
	providers: [provideBrnNavigationMenuFocusable(BrnNavigationMenuLink)],
})
export class BrnNavigationMenuLink implements FocusableOption {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _el = inject(ElementRef);

	protected readonly _isActive = this._navigationMenuItem.isActive;

	public get disabled() {
		return this._navigationMenuItem.disabled();
	}

	public focus(_origin?: FocusOrigin) {
		if (this._navigationMenuItem.disabled()) return;

		this._el.nativeElement.focus();
	}

	protected handleFocus() {
		this._navigationMenu.setActiveItem(this);
	}

	protected onClick() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}

	protected activate() {
		this._navigationMenu.value.set(this._navigationMenuItem.id());
	}
}
