import { Component } from '@angular/core';
import { BrnInputOtpComponent } from '@spartan-ng/brain/input-otp';
import {
	HlmInputOtpDirective,
	HlmInputOtpGroupDirective,
	HlmInputOtpSeparatorComponent,
	HlmInputOtpSlotDirective,
} from '@spartan-ng/ui-input-otp-helm';

@Component({
	selector: 'spartan-input-otp-preview',
	standalone: true,
	imports: [
		HlmInputOtpDirective,
		HlmInputOtpGroupDirective,
		HlmInputOtpSeparatorComponent,
		HlmInputOtpSlotDirective,
		BrnInputOtpComponent,
	],
	template: `
		<hlm-input-otp maxLength="6" inputClass="disabled:cursor-not-allowed ">
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
		</hlm-input-otp>
	`,
})
export class InputOtpPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { BrnInputOtpComponent } from '@spartan-ng/brain/input-otp';
import {
	HlmInputOtpDirective,
	HlmInputOtpGroupDirective,
	HlmInputOtpSeparatorComponent,
	HlmInputOtpSlotDirective,
} from '@spartan-ng/ui-input-otp-helm';

@Component({
	selector: 'spartan-input-otp-preview',
	standalone: true,
	imports: [
		HlmInputOtpDirective,
		HlmInputOtpGroupDirective,
		HlmInputOtpSeparatorComponent,
		HlmInputOtpSlotDirective,
		BrnInputOtpComponent,
	],
	template: \`
		<hlm-input-otp maxLength="6" inputClass="disabled:cursor-not-allowed ">
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
		</hlm-input-otp>
	\`,
})
export class InputOtpPreviewComponent {}
`;

export const defaultImports = `
import { BrnInputOtpComponent } from '@spartan-ng/brain/input-otp';
import {
	HlmInputOtpDirective,
	HlmInputOtpGroupDirective,
	HlmInputOtpSeparatorComponent,
	HlmInputOtpSlotDirective,
} from '@spartan-ng/ui-input-otp-helm';
`;
export const defaultSkeleton = `
<hlm-input-otp maxLength="6" inputClass="disabled:cursor-not-allowed ">
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
</hlm-input-otp>
`;
