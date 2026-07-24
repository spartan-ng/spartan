import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'div[hlmSidebarGroupLabel], button[hlmSidebarGroupLabel]',
	host: {
		'data-slot': 'sidebar-group-label',
		'data-sidebar': 'group-label',
	},
})
export class HlmSidebarGroupLabel {
	constructor() {
		classes(() => 'spartan-sidebar-group-label flex shrink-0 items-center outline-hidden [&>ng-icon]:shrink-0');
	}
}
