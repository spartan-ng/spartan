import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmFieldGroup],hlm-field-group',
	host: { 'data-slot': 'field-group' },
})
export class HlmFieldGroup {
	constructor() {
		classes(() => 'spartan-field-group group/field-group @container/field-group flex w-full flex-col');
	}
}
