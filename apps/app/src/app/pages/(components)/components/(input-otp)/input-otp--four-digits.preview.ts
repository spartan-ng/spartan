import { Component } from '@angular/core';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-four-digits',
	imports: [HlmInputOtpImports],
	template: `
		<hlm-input-otp slotPattern="[0-9]" length="4">
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="0" />
				<hlm-input-otp-slot index="1" />
				<hlm-input-otp-slot index="2" />
				<hlm-input-otp-slot index="3" />
			</hlm-input-otp-group>
		</hlm-input-otp>
	`,
})
export class InputOtpFourDigits {}
