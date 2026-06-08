import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmDrawerTitle]',
	host: {
		'data-slot': 'drawer-title',
	},
})
export class HlmDrawerTitle {
	constructor() {
		classes(() => 'text-foreground text-lg leading-none font-semibold tracking-tight');
	}
}
