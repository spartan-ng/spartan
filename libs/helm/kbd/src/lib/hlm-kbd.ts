import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'kbd[hlmKbd]',
	host: {
		'data-slot': 'kbd',
	},
})
export class HlmKbd {
	constructor() {
		classes(() => 'spartan-kbd pointer-events-none inline-flex items-center justify-center select-none');
	}
}
