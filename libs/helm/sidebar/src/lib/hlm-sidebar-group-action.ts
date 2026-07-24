import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmSidebarGroupAction]',
	host: {
		'data-slot': 'sidebar-group-action',
		'data-sidebar': 'group-action',
	},
})
export class HlmSidebarGroupAction {
	constructor() {
		classes(
			() =>
				'spartan-sidebar-group-action flex aspect-square items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>ng-icon]:shrink-0',
		);
	}
}
