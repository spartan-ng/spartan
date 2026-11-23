import { Directive } from '@angular/core';
import { BrnConfirmationApprove } from '@spartan-ng/brain/confirmation';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'button[hlmConfirmationApprove],[hlmConfirmationApprove]',
	exportAs: 'hlmConfirmationApprove',
	hostDirectives: [
		{
			directive: BrnConfirmationApprove,
		},
	],
	host: {
		'data-slot': 'confirmation-approve',
	},
})
export class HlmConfirmationApprove {
	constructor() {
		classes(() => 'spartan-confirmation-approve');
	}
}
