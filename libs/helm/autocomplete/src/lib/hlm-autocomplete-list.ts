import { Directive } from '@angular/core';
import { BrnAutocompleteList } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteList]',
	hostDirectives: [{ directive: BrnAutocompleteList, inputs: ['id'] }],
	host: { 'data-slot': 'autocomplete-list' },
})
export class HlmAutocompleteList {
	constructor() {
		classes(() => 'spartan-autocomplete-list overflow-y-auto overscroll-contain');
	}
}
