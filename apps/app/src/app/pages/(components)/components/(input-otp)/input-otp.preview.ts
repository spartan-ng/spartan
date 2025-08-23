import { Component } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-preview',
	imports: [HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot, BrnInputOtp],
	template: `
		<brn-input-otp hlmInputOtp maxLength="6" inputClass="disabled:cursor-not-allowed">
			<div hlmInputOtpGroup>
				<hlm-input-otp-slot index="0" />
				<hlm-input-otp-slot index="1" />
				<hlm-input-otp-slot index="2" />
			</div>
			<hlm-input-otp-separator />
			<div hlmInputOtpGroup>
				<hlm-input-otp-slot index="3" />
				<hlm-input-otp-slot index="4" />
				<hlm-input-otp-slot index="5" />
			</div>
		</brn-input-otp>
	`,
})
export class InputOtpPreview {}

export const defaultImports = `
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import {
	HlmInputOtp
	HlmInputOtpGroup
	HlmInputOtpSeparator
	HlmInputOtpSlot
} from '@spartan-ng/helm/input-otp';
`;
export const defaultSkeleton = `
<brn-input-otp hlmInputOtp maxLength="6" inputClass="disabled:cursor-not-allowed">
	<div hlmInputOtpGroup>
		<hlm-input-otp-slot index="0" />
		<hlm-input-otp-slot index="1" />
		<hlm-input-otp-slot index="2" />
	</div>
	<hlm-input-otp-separator />
	<div hlmInputOtpGroup>
		<hlm-input-otp-slot index="3" />
		<hlm-input-otp-slot index="4" />
		<hlm-input-otp-slot index="5" />
	</div>
</brn-input-otp>
`;
