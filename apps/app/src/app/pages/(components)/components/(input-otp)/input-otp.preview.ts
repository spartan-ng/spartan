import { Component } from '@angular/core';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-preview',
	imports: [HlmInputOtpImports],
	template: `
		<hlm-input-otp length="6">
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
	`,
})
export class InputOtpPreview {}

export const defaultImports = `
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';
`;
export const defaultSkeleton = `
<hlm-input-otp length="6">
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
`;
