import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';
import { injectBrnNavigationMenu } from './brn-navigation-menu.token';

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

	protected readonly isActive = this._navigationMenuItem.isActive;
	protected readonly state = this._navigationMenuItem.state;

	protected readonly _orientation = this._navigationMenu.context().orientation;
}
