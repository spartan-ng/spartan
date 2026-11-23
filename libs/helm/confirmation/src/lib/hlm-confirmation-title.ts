import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmConfirmationTitle],hlm-confirmation-title',
	exportAs: 'hlmConfirmationTitle',
	host: {
		'data-slot': 'confirmation-title',
	},
})
export class HlmConfirmationTitle {
	constructor() {
		classes(() => 'spartan-confirmation-title text-sm leading-none font-medium');
	}
}
