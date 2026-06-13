import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerHeader],hlm-drawer-header',
	host: { 'data-slot': 'drawer-header' },
})
export class HlmDrawerHeader {
	constructor() {
		classes(() => 'spartan-drawer-header flex flex-col');
	}
}
