import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmSelectLabel],hlm-select-label',
	host: {
		'data-slot': 'select-label',
	},
})
export class HlmSelectLabel {
	constructor() {
		classes(() => 'text-muted-foreground block px-2 py-1.5 text-xs');
	}
}
