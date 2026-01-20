import { Directive } from '@angular/core';
import { BrnAutocompleteStatus } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteStatus],hlm-autocomplete-status',
	hostDirectives: [BrnAutocompleteStatus],
	host: {
		'data-slot': 'autocomplete-status',
	},
})
export class HlmAutocompleteStatus {
	constructor() {
		classes(() => 'text-muted-foreground flex w-full items-center justify-center gap-2 px-3 py-2 text-center text-sm');
	}
}
