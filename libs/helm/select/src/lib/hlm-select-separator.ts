import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelectSeparator]',
	host: {
		'data-slot': 'select-separator',
	},
})
export class HlmSelectSeparator {
	constructor() {
		classes(() => 'bg-border pointer-events-none -mx-1 my-1 h-px');
	}
}
