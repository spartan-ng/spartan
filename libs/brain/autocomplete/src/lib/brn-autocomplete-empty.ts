import { Directive } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteEmpty]',
	exportAs: 'brnAutocompleteEmpty',
	host: {
		role: 'status',
		'aria-live': 'polite',
		'aria-atomic': 'true',
	},
})
export class BrnAutocompleteEmpty {}
