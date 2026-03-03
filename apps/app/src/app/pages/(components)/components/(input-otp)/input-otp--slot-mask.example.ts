import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-input-otp-slot-mask',
	imports: [ReactiveFormsModule, HlmButton, HlmToaster, BrnInputOtp, HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSlot],
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
			>
				<div hlmInputOtpGroup>
					@for (num of mobileDigits; track num; let count = $count; let i = $index) {
						<hlm-input-otp-slot [mask]="i < count - 3" [index]="i" />
					}
				</div>
			</brn-input-otp>

			<div class="flex flex-col gap-4">
				<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
			</div>
		</form>
	`,
})
export class InputOtpMaskSlotExample {
	private readonly _formBuilder = inject(FormBuilder);

	public readonly mobileDigits = Array.from({ length: 11 }, (_, i) => i);
	public maxLength = 11;

	/** Overrides global formatDate  */
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
