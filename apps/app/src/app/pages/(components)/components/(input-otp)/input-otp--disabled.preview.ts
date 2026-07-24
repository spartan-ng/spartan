import { Component } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-disabled',
	imports: [HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot, BrnInputOtp],
	template: `
		<brn-input-otp hlmInputOtp value="123456" disabled maxLength="6" inputClass="disabled:cursor-not-allowed">
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="0" />
				<hlm-input-otp-slot index="1" />
				<hlm-input-otp-slot index="2" />
			</hlm-input-otp-group>
			<hlm-input-otp-separator />
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="3" />
				<hlm-input-otp-slot index="4" />
				<hlm-input-otp-slot index="5" />
			</hlm-input-otp-group>
		</brn-input-otp>
	`,
})
export class InputOtpDisabled {}
