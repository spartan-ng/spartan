import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmConfirmationDescription],hlm-confirmation-description',
	exportAs: 'hlmConfirmationDescription',
	host: {
		'data-slot': 'confirmation-description',
	},
})
export class HlmConfirmationDescription {
	constructor() {
		classes(() => 'spartan-confirmation-description text-muted-foreground text-sm');
	}
}
