import { afterNextRender, Component, computed, inject, type OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputOtp, HlmInputOtpGroup, HlmInputOtpSlot } from '@spartan-ng/helm/input-otp';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { toast } from 'ngx-sonner';

@Component({
	selector: 'spartan-input-otp-form',
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
					<hlm-input-otp-slot index="0" />
					<hlm-input-otp-slot index="1" />
					<hlm-input-otp-slot index="2" />
					<hlm-input-otp-slot index="3" />
					<hlm-input-otp-slot index="4" />
					<hlm-input-otp-slot index="5" />
				</div>
			</brn-input-otp>

			<div class="flex flex-col gap-4">
				<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				<button type="button" hlmBtn variant="ghost" [disabled]="isResendDisabled()" (click)="resendOtp()">
					Resend in {{ countdown() }}s
				</button>
			</div>
		</form>
	`,
})
export class InputOtpFormExample implements OnDestroy {
	private readonly _formBuilder = inject(FormBuilder);
	private _intervalId?: NodeJS.Timeout;

	public readonly countdown = signal(60);
	public readonly isResendDisabled = computed(() => this.countdown() > 0);

	public maxLength = 6;

	/** Overrides global formatDate  */
	public transformPaste = (pastedText: string) => pastedText.replaceAll('-', '');

	public form = this._formBuilder.group({
		otp: [null, [Validators.required, Validators.minLength(this.maxLength), Validators.maxLength(this.maxLength)]],
	});

	constructor() {
		afterNextRender(() => this.startCountdown());
	}

	submit() {
		console.log(this.form.value);
		toast('OTP submitted', {
			description: `Your OTP ${this.form.value.otp} has been submitted`,
		});
	}

	resendOtp() {
		// add your api request here to resend OTP
		this.resetCountdown();
	}

	ngOnDestroy() {
		this.stopCountdown();
	}

	private resetCountdown() {
		this.countdown.set(60);
		this.startCountdown();
	}

	private startCountdown() {
		this.stopCountdown();
		this._intervalId = setInterval(() => {
			this.countdown.update((countdown) => Math.max(0, countdown - 1));
			if (this.countdown() === 0) {
				this.stopCountdown();
			}
		}, 1000);
	}

	private stopCountdown() {
		if (this._intervalId) {
			clearInterval(this._intervalId);
			this._intervalId = undefined;
		}
	}
}
