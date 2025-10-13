import { Directive, inject, TemplateRef } from '@angular/core';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';

@Directive({
	selector: '[brnNavigationMenuContent]',
})
export class BrnNavigationMenuContent {
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _tpl = inject(TemplateRef);

	constructor() {
		if (!this._tpl) return;
		this._navigationMenuItem.contentTemplate.set(this._tpl);
	}
}
