import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'ul[hlmSidebarMenuSub]',
	host: {
		'data-slot': 'sidebar-menu-sub',
		'data-sidebar': 'menu-sub',
	},
})
export class HlmSidebarMenuSub {
	constructor() {
		classes(() => [
			'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
			'group-data-[collapsible=icon]:hidden',
		]);
	}
}
