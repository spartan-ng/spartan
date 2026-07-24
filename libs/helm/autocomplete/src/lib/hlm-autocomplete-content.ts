import { Directive } from '@angular/core';
import { BrnAutocompleteContent } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteContent],hlm-autocomplete-content',
	hostDirectives: [BrnAutocompleteContent],
})
export class HlmAutocompleteContent {
	constructor() {
		classes(
			() => 'group/autocomplete-content spartan-autocomplete-content flex w-(--brn-autocomplete-width) flex-col p-0',
		);
	}
}
