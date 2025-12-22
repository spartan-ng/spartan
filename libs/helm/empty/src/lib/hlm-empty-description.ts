import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmEmptyDescription]',
	host: {
		'data-slot': 'empty-description',
	},
})
export class HlmEmptyDescription {
	constructor() {
		classes(
			() => 'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
		);
	}
}
