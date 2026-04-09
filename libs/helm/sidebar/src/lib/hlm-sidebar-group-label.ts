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
		classes(() => [
			'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium transition-[margin,opa] duration-200 ease-linear outline-none focus-visible:ring-2 [&>_[hlmIcon]]:size-4 [&>_[hlmIcon]]:shrink-0',
			'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
		]);
	}
}
