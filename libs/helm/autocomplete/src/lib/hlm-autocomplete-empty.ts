import { Directive } from '@angular/core';
import { BrnAutocompleteEmpty } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteEmpty],hlm-autocomplete-empty',
	hostDirectives: [BrnAutocompleteEmpty],
	host: { 'data-slot': 'autocomplete-empty' },
})
export class HlmAutocompleteEmpty {
	constructor() {
		classes(() => 'spartan-autocomplete-empty');
	}
}
