import { Directive } from '@angular/core';

@Directive({
	selector: '[brnComboboxStatus]',
	exportAs: 'brnComboboxStatus',
	host: {
		role: 'status',
		'aria-live': 'polite',
		'aria-atomic': 'true',
	},
})
export class BrnComboboxStatus {}
