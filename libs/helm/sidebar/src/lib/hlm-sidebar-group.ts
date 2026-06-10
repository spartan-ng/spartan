import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSidebarGroup],hlm-sidebar-group',
	host: {
		'data-slot': 'sidebar-group',
		'data-sidebar': 'group',
	},
})
export class HlmSidebarGroup {
	constructor() {
		classes(() => 'spartan-sidebar-group relative flex w-full min-w-0 flex-col');
	}
}
