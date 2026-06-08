import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerFooter]',
	host: {
		'data-slot': 'drawer-footer',
	},
})
export class HlmDrawerFooter {
	constructor() {
		classes(() => 'flex flex-col gap-2 p-4');
	}
}
