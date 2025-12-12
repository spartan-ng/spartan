import { Directive } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSidebarSeparator],hlm-sidebar-separator',
	hostDirectives: [{ directive: HlmSeparator }],
	host: {
		'data-slot': 'sidebar-separator',
		'data-sidebar': 'separator',
	},
})
export class HlmSidebarSeparator {
	constructor() {
		classes(() => 'bg-sidebar-border mx-2 w-auto');
	}
}
