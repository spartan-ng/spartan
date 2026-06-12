import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmSidebarMenuAction]',
	host: {
		'data-slot': 'sidebar-menu-action',
		'data-sidebar': 'menu-action',
	},
})
export class HlmSidebarMenuAction {
	public readonly showOnHover = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	constructor() {
		classes(() => [
			'spartan-sidebar-menu-action flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>ng-icon]:shrink-0',
			this.showOnHover() &&
				'peer-data-active/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 md:opacity-0',
		]);
	}
}
