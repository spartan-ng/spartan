import { Component } from '@angular/core';
import { BrnInputOtpImports } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-separator',
	imports: [HlmInputOtpImports, BrnInputOtpImports],
	template: `
		<brn-input-otp hlmInputOtp maxLength="6" inputClass="disabled:cursor-not-allowed">
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="0" />
				<hlm-input-otp-slot index="1" />
			</hlm-input-otp-group>
			<hlm-input-otp-separator />
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="2" />
				<hlm-input-otp-slot index="3" />
			</hlm-input-otp-group>
			<hlm-input-otp-separator />
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="4" />
				<hlm-input-otp-slot index="5" />
			</hlm-input-otp-group>
		</brn-input-otp>
	`,
})
export class InputOtpSeparator {}
