import { Directive } from '@angular/core';
import { BrnConfirmationReject } from '@spartan-ng/brain/confirmation';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmConfirmationReject],[hlmConfirmationReject]',
	exportAs: 'hlmConfirmationReject',
	hostDirectives: [
		{
			directive: BrnConfirmationReject,
			inputs: ['reason'],
		},
	],
	host: {
		'data-slot': 'confirmation-reject',
	},
})
export class HlmConfirmationReject {
	constructor() {
		classes(() => 'spartan-confirmation-reject');
	}
}
