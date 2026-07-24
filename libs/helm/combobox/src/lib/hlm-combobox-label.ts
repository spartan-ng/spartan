import { Directive } from '@angular/core';
import { BrnComboboxLabel } from '@spartan-ng/brain/combobox';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmComboboxLabel]',
	hostDirectives: [{ directive: BrnComboboxLabel, inputs: ['id'] }],
	host: { 'data-slot': 'combobox-label' },
})
export class HlmComboboxLabel {
	constructor() {
		classes(() => 'spartan-combobox-label');
	}
}
