import { Directive } from '@angular/core';
import { BrnAutocompleteEmpty } from '@spartan-ng/brain/autocomplete';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmAutocompleteEmpty],hlm-autocomplete-empty',
	hostDirectives: [BrnAutocompleteEmpty],
	host: {
		'data-slot': 'autocomplete-empty',
	},
})
export class HlmAutocompleteEmpty {
	constructor() {
		classes(
			() =>
				'text-muted-foreground hidden w-full items-center justify-center gap-2 py-2 text-center text-sm group-data-empty/autocomplete-content:flex',
		);
	}
}
