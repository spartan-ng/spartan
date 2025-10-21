import { computed, Directive, effect, inject, Renderer2, TemplateRef, untracked } from '@angular/core';
import { Subject } from 'rxjs';
import { BrnNavigationMenuContentService } from './brn-navigation-menu-content.service';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';
import { provideBrnParentNavMenu } from './brn-parent-nav-menu.token';

const subNavHover$ = new Subject<boolean>();

@Directive({
	selector: '[brnNavigationMenuContent]',
	providers: [provideBrnParentNavMenu({ subNavHover$: subNavHover$ })],
})
export class BrnNavigationMenuContent {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _contentService = inject(BrnNavigationMenuContentService);
	private readonly _tpl = inject(TemplateRef);
	private readonly _renderer = inject(Renderer2);

	private readonly _menuItemsIds = this._navigationMenu.menuItemsIds;
	private readonly _navMenuValue = this._navigationMenu.value;
	private readonly _prevNavMenuValue = this._navigationMenu.previousValue;

	private readonly _id = this._navigationMenuItem.id;
	private readonly _isActive = this._navigationMenuItem.isActive;
	private readonly _wasActive = this._navigationMenuItem.wasActive;
	private readonly _state = this._navigationMenuItem.state;

	private readonly _contentEl = this._contentService.contentEl;

	private readonly _orientation = computed(() => this._navigationMenu.context().orientation);
	private readonly _dir = computed(() => this._navigationMenu.context().dir);

	constructor() {
		if (!this._tpl) return;
		this._navigationMenuItem.contentTemplate.set(this._tpl);
		this._navigationMenuItem.subNavHover$.next(subNavHover$);

		effect(() => {
			const el = this._contentEl();
			if (el) {
				this._renderer.setAttribute(el, 'tabindex', '0');
			}
		});

		effect(() => {
			const el = this._contentEl();
			if (el) {
				this._renderer.setAttribute(el, 'data-state', this._state());
			}
		});

		effect(() => {
			const el = this._contentEl();
			if (el) {
				this._renderer.setAttribute(el, 'data-orientation', this._orientation());
			}
		});

		effect(() => {
			const isActive = this._isActive();
			const wasActive = this._wasActive();
			const dir = this._dir();
			const orientation = this._orientation();

			const el = untracked(this._contentEl);
			if (!el) return;

			const id = this._id();
			const prevNavMenuValue = this._prevNavMenuValue();
			const menuItemsIds =
				dir === 'rtl' && orientation === 'horizontal' ? this._menuItemsIds().slice().reverse() : this._menuItemsIds();

			if (isActive) {
				if (prevNavMenuValue) {
					const motion = menuItemsIds.indexOf(id) > menuItemsIds.indexOf(prevNavMenuValue) ? 'from-end' : 'from-start';
					this._renderer.setAttribute(el, 'data-motion', motion);
				}
			} else if (wasActive) {
				const navMenuValue = this._navMenuValue();
				if (!navMenuValue) return;

				const motion = menuItemsIds.indexOf(id) > menuItemsIds.indexOf(navMenuValue) ? 'to-end' : 'to-start';
				this._renderer.setAttribute(el, 'data-motion', motion);
			}
		});
	}
}
