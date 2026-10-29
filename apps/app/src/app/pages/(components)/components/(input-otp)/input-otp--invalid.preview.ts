import { Component } from '@angular/core';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-invalid',
	imports: [HlmInputOtpImports],
	template: `
		<hlm-input-otp length="6">
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="0" forceInvalid />
				<hlm-input-otp-slot index="1" forceInvalid />
				<hlm-input-otp-slot index="2" forceInvalid />
			</hlm-input-otp-group>
			<hlm-input-otp-separator />
			<hlm-input-otp-group>
				<hlm-input-otp-slot index="3" forceInvalid />
				<hlm-input-otp-slot index="4" forceInvalid />
				<hlm-input-otp-slot index="5" forceInvalid />
			</hlm-input-otp-group>
		</hlm-input-otp>
	`,
})
export class InputOtpInvalid {}
