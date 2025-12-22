import { Directive } from '@angular/core';
import { BrnAutocompleteList } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteList],hlm-autocomplete-list',
	hostDirectives: [
		{
			directive: BrnAutocompleteList,
			inputs: ['id'],
		},
	],
})
export class HlmAutocompleteList {
	constructor() {
		classes(() => 'block max-h-60 overflow-x-hidden overflow-y-auto');
	}
}
