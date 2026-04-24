import { Directive } from '@angular/core';
import { BrnInputOtpMask } from '@spartan-ng/brain/input-otp';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: '[hlmInputOtpGroup]',
	hostDirectives: [{ directive: BrnInputOtpMask, inputs: ['mask'] }],
	host: {
		'data-slot': 'input-otp-group',
	},
})
export class HlmInputOtpGroup {
	constructor() {
		classes(() => 'flex items-center');
	}
}
