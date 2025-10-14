import { Directive, effect, inject, Renderer2, TemplateRef } from '@angular/core';
import { BrnNavigationMenuContentService } from './brn-navigation-menu-content.service';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: '[brnNavigationMenuContent]',
})
export class BrnNavigationMenuContent {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _contentService = inject(BrnNavigationMenuContentService);
	private readonly _tpl = inject(TemplateRef);
	private readonly _renderer = inject(Renderer2);

	private readonly _previousSelected = this._navigationMenu.previousValue;
	private readonly _id = this._navigationMenuItem.id;
	private readonly _menuItems = this._navigationMenu.menuItemsIds;
	private readonly _isActive = this._navigationMenuItem.isActive;
	private readonly _state = this._navigationMenuItem.state;

	private readonly _contentEl = this._contentService.contentEl;

	constructor() {
		if (!this._tpl) return;
		this._navigationMenuItem.contentTemplate.set(this._tpl);

		effect(() => {
			const el = this._contentEl();
			if (el) {
				this._renderer.setAttribute(el, 'data-state', this._state());
			}
		});

		effect(() => {
			// TODO: WIP
			// const isActive = this._isActive();
			// if (isActive) {
			// 	const previousSelected = this._previousSelected();
			// 	const id = this._id();
			// 	const menuItems = this._menuItems();
			// 	if (previousSelected) {
			// 		const motion = menuItems.indexOf(id) > menuItems.indexOf(previousSelected) ? 'from-end' : 'to-end';
			// 		const el = this._contentEl();
			// 		if (el) {
			// 			this._renderer.setAttribute(el, 'data-motion', motion);
			// 		}
			// 	}
			// }
		});
	}
}
