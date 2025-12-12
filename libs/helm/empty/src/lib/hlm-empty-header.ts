import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmEmptyHeader],hlm-empty-header',
	host: {
		'data-slot': 'empty-header',
	},
})
export class HlmEmptyHeader {
	constructor() {
		classes(() => 'flex max-w-sm flex-col items-center gap-2 text-center');
	}
}
