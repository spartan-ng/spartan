import { Directive } from '@angular/core';

@Directive({
	selector: '[brnComboboxEmpty]',
	host: {
		role: 'status',
		'aria-live': 'polite',
		'aria-atomic': 'true',
	},
})
export class BrnComboboxEmpty {}
