import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'brn-input-otp[hlmInputOtp], brn-input-otp[hlm]',
	host: {
		'data-slot': 'input-otp',
	},
})
export class HlmInputOtp {
	constructor() {
		classes(() => 'flex items-center gap-2 has-disabled:opacity-50');
	}
}
