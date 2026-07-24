import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmFieldTitle],hlm-field-title',
	host: { 'data-slot': 'field-label' },
})
export class HlmFieldTitle {
	constructor() {
		classes(() => 'spartan-field-title flex w-fit items-center');
	}
}
