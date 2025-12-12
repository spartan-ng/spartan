import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmFieldDescription],hlm-field-description',
	host: {
		'data-slot': 'field-description',
	},
})
export class HlmFieldDescription {
	constructor() {
		classes(() => [
			'text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
			'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
			'[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
		]);
	}
}
