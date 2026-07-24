import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAlertDescription]',
	host: {
		'data-slot': 'alert-description',
	},
})
export class HlmAlertDescription {
	constructor() {
		classes(() => 'spartan-alert-description [&_a]:hover:text-foreground [&_a]:underline [&_a]:underline-offset-3');
	}
}
