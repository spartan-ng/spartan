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
		classes(
			() =>
				'text-muted-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4',
		);
	}
}
