import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerHeader],hlm-drawer-header',
	exportAs: 'hlmDrawerHeader',
	host: { 'data-slot': 'drawer-header' },
})
export class HlmDrawerHeader {
	constructor() {
		classes(() => 'spartan-drawer-header flex shrink-0 flex-col group-data-[swipe-axis=y]/drawer-popup:text-center');
	}
}
