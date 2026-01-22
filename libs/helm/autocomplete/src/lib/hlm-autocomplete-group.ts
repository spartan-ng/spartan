import { Directive } from '@angular/core';
import { BrnAutocompleteGroup } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteGroup]',
	hostDirectives: [BrnAutocompleteGroup],
	host: {
		'data-slot': 'autocomplete-group',
	},
})
export class HlmAutocompleteGroup {
	constructor() {
		classes(() => 'data-hidden:hidden');
	}
}
