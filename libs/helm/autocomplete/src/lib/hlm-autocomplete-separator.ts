import { Directive } from '@angular/core';
import { BrnAutocompleteSeparator } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteSeparator]',
	hostDirectives: [{ directive: BrnAutocompleteSeparator, inputs: ['orientation'] }],
	host: {
		'data-slot': 'autocomplete-separator',
	},
})
export class HlmAutocompleteSeparator {
	constructor() {
		classes(() => 'bg-border -mx-1 my-1 h-px');
	}
}
