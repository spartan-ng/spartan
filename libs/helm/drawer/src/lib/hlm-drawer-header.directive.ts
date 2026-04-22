import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerHeader]',
	host: {
		'data-slot': 'drawer-header',
	},
})
export class HlmDrawerHeader {
	constructor() {
		classes(() => 'flex flex-col gap-1.5 p-4 text-center sm:text-left');
	}
}
