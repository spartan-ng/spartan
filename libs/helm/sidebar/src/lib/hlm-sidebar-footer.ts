import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSidebarFooter],hlm-sidebar-footer',
	host: {
		'data-slot': 'sidebar-footer',
		'data-sidebar': 'footer',
	},
})
export class HlmSidebarFooter {
	constructor() {
		classes(() => 'flex flex-col gap-2 p-2');
	}
}
