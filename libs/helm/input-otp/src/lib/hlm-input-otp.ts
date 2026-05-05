import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'brn-input-otp[hlmInputOtp], brn-input-otp[hlm]',
	host: { 'data-slot': 'input-otp' },
})
export class HlmInputOtp {
	constructor() {
		classes(() => 'spartan-input-otp flex items-center has-disabled:opacity-50');
	}
}
