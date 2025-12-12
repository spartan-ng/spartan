import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmInputOtpGroup]',
	host: {
		'data-slot': 'input-otp-group',
	},
})
export class HlmInputOtpGroup {
	constructor() {
		classes(() => 'flex items-center');
	}
}
