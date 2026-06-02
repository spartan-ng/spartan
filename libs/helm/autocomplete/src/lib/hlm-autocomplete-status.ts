import { Directive } from '@angular/core';
import { BrnAutocompleteStatus } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteStatus],hlm-autocomplete-status',
	hostDirectives: [BrnAutocompleteStatus],
	host: { 'data-slot': 'autocomplete-status' },
})
export class HlmAutocompleteStatus {
	constructor() {
		classes(() => 'spartan-autocomplete-status flex w-full items-center justify-center text-center');
	}
}
