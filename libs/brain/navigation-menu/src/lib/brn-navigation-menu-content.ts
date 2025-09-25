import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectBrnNavigationMenuItem } from './brn-navigation-menu-item.token';

@Component({
	selector: 'brn-navigation-menu-content',
	host: {
		'[attr.data-state]': 'state()',
	},
	template: `
		@if (isActive()) {
			<ng-content />
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnNavigationMenuContent {
	private readonly _navigationMenuItem = injectBrnNavigationMenuItem();

	protected readonly isActive = this._navigationMenuItem.isActive;
	protected readonly state = this._navigationMenuItem.state;
}
