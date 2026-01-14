import { Directive } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteEmpty]',
	host: {
		role: 'status',
		'aria-live': 'polite',
		'aria-atomic': 'true',
	},
})
export class BrnAutocompleteEmpty {}
