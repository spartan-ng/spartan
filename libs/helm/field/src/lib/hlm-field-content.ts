import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmFieldContent],hlm-field-content',
	host: {
		'data-slot': 'field-content',
	},
})
export class HlmFieldContent {
	constructor() {
		classes(() => 'group/field-content flex flex-1 flex-col gap-1.5 leading-snug');
	}
}
