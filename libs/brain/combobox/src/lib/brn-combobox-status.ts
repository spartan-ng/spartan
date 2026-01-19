import { Directive } from '@angular/core';

@Directive({
	selector: '[brnComboboxStatus]',
	host: {
		role: 'status',
		'aria-live': 'polite',
		'aria-atomic': 'true',
	},
})
export class BrnComboboxStatus {}
