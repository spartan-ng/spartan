import { computed, Directive, input, signal, TemplateRef } from '@angular/core';
import { provideBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

@Directive({
	selector: 'li[brnNavigationMenuItem]',
	host: {
		'[id]': 'id()',
	},
	providers: [provideBrnNavigationMenuItem(BrnNavigationMenuItem)],
})
export class BrnNavigationMenuItem {
	private static _id = 0;

	private readonly _navigationMenu = injectBrnNavigationMenu();

	/** The id of the navigation menu item */
	public readonly id = input<string>(`brn-navigation-menu-item-${++BrnNavigationMenuItem._id}`);

	public readonly isActive = computed(() => this.id() === this._navigationMenu.value());

	public readonly wasActive = computed(() => this.id() === this._navigationMenu.previousValue());

	public readonly state = computed(() => (this.isActive() ? 'open' : 'closed'));

	public readonly contentTemplate = signal<TemplateRef<unknown> | null>(null);
}
