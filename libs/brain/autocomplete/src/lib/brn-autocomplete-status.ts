import { Directive } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteStatus]',
	exportAs: 'brnAutocompleteStatus',
	host: {
		role: 'status',
		'aria-live': 'polite',
		'aria-atomic': 'true',
	},
})
export class BrnAutocompleteStatus {}
