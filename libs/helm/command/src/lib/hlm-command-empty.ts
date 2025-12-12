import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmCommandEmpty]',
	host: {
		'data-slot': 'command-empty',
	},
})
export class HlmCommandEmpty {
	constructor() {
		classes(() => 'py-6 text-center text-sm');
	}
}
