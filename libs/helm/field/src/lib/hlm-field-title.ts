import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmFieldTitle],hlm-field-title',
	host: {
		'data-slot': 'field-label',
	},
})
export class HlmFieldTitle {
	constructor() {
		classes(
			() =>
				'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
		);
	}
}
