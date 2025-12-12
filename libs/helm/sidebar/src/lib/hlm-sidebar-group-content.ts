import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'div[hlmSidebarGroupContent]',
	host: {
		'data-slot': 'sidebar-group-content',
		'data-sidebar': 'group-content',
	},
})
export class HlmSidebarGroupContent {
	constructor() {
		classes(() => 'w-full text-sm');
	}
}
