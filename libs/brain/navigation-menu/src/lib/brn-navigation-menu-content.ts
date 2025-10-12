import { ChangeDetectionStrategy, Component, computed, inject, TemplateRef } from '@angular/core';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

// TODO: Convert to structural directive
@Component({
	selector: 'brn-navigation-menu-content',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.data-orientation]': '_orientation()',
	},
	template: `
		@if (isActive()) {
			<ng-content />
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnNavigationMenuContent {
	private readonly _navigationMenu = injectBrnNavigationMenu();
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();
	private readonly _tpl = inject(TemplateRef);

	protected readonly isActive = this._navigationMenuItem.isActive;
	protected readonly state = this._navigationMenuItem.state;

	protected readonly _orientation = computed(() => this._navigationMenu.context().orientation);

	constructor() {
		if (!this._tpl) return;
		this._navigationMenuItem.contentTemplate.set(this._tpl);
	}
}
