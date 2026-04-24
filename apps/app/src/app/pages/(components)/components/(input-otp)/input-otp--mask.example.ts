import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSeparator, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-input-otp-mask',
	imports: [
		ReactiveFormsModule,
		HlmButton,
		HlmToaster,
		BrnInputOtp,
		HlmInputOtp,
		HlmInputOtpGroup,
		HlmInputOtpSlot,
		HlmInputOtpSeparator,
	],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
	template: `
		<hlm-toaster />

		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<brn-input-otp
				hlmInputOtp
				[maxLength]="maxLength"
				inputClass="disabled:cursor-not-allowed"
				formControlName="otp"
				[transformPaste]="transformPaste"
				(completed)="submit()"
				[mask]="true"
			>
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

			<div class="flex flex-col gap-4">
				<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
			</div>
		</form>
	`,
})
export class InputOtpMaskExample {
	private readonly _formBuilder = inject(FormBuilder);

	public maxLength = 6;

	public transformPaste = (pastedText: string) => pastedText.replaceAll('-', '');

	public form = this._formBuilder.group({
		otp: [null, [Validators.required, Validators.minLength(this.maxLength), Validators.maxLength(this.maxLength)]],
	});

	submit() {
		console.log(this.form.value);
		toast('OTP submitted', {
			description: `Your OTP ${this.form.value.otp} has been submitted`,
		});
	}
}
