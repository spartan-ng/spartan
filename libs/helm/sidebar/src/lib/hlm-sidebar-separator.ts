import { Directive } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSidebarSeparator],hlm-sidebar-separator',
	exportAs: 'hlmSidebarSeparator',
	hostDirectives: [HlmSeparator],
	host: {
		'data-slot': 'sidebar-separator',
		'data-sidebar': 'separator',
	},
})
export class HlmSidebarSeparator {
	constructor() {
		classes(() => 'spartan-sidebar-separator w-auto');
	}
}
