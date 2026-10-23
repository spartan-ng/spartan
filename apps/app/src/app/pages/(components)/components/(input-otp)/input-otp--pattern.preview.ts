import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-pattern',
	imports: [HlmFieldImports, HlmInputOtpImports],
	template: `
		<hlm-field class="mx-auto max-w-xs">
			<label hlmFieldLabel for="input-otp-pattern">Digit only</label>
			<hlm-input-otp inputId="input-otp-pattern" slotPattern="[0-9]" length="6">
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
			</hlm-input-otp>
		</hlm-field>
	`,
})
export class InputOtpPattern {}
