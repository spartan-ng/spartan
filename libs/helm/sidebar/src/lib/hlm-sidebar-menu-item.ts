import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'li[hlmSidebarMenuItem]',
	host: {
		'data-slot': 'sidebar-menu-item',
		'data-sidebar': 'menu-item',
	},
})
export class HlmSidebarMenuItem {
	constructor() {
		classes(() => 'group/menu-item relative');
	}
}
