import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'fieldset[hlmFieldSet]',
	host: { 'data-slot': 'field-set' },
})
export class HlmFieldSet {
	constructor() {
		classes(() => 'spartan-field-set flex flex-col');
	}
}
