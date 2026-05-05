import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmInputOtpGroup],hlm-input-otp-group',
	host: { 'data-slot': 'input-otp-group' },
})
export class HlmInputOtpGroup {
	constructor() {
		classes(() => 'spartan-input-otp-group flex items-center');
	}
}
