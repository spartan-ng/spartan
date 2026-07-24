import { afterNextRender, Component, computed, type OnDestroy, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw } from '@ng-icons/lucide';
import { BrnInputOtpImports } from '@spartan-ng/brain/input-otp';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
	selector: 'spartan-input-otp-form',
	imports: [
		FormRoot,
		FormField,
		NgIcon,
		HlmButtonImports,
		HlmToasterImports,
		HlmCardImports,
		HlmFieldImports,
		BrnInputOtpImports,
		HlmInputOtpImports,
	],
	providers: [provideIcons({ lucideRefreshCw })],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center items-center max-w-lg',
	},
	template: `
		<hlm-toaster />
		<hlm-card class="mx-auto">
			<hlm-card-header>
				<div hlmCardTitle>Verify your login</div>
				<div hlmCardDescription>
					Enter the verification code we sent to your email address:
					<span class="font-medium">m@example.com</span>
					.
				</div>
			</hlm-card-header>

			<form hlmCardContent id="otp-form" [formRoot]="form">
				<hlm-field>
					<div class="flex items-center justify-between">
						<label hlmFieldLabel>Verification code</label>
						<button hlmBtn variant="outline" size="xs" [disabled]="isResendDisabled()" (click)="resendOtp()">
							<ng-icon name="lucideRefreshCw" />
							Resend code
							@if (countdown() > 0) {
								in {{ countdown() }}s
							}
						</button>
					</div>
					<brn-input-otp
						hlmInputOtp
						[length]="maxLength"
						inputId="otp-verification"
						inputClass="disabled:cursor-not-allowed"
						[formField]="form.otp"
						[transformPaste]="transformPaste"
						(completed)="submit()"
					>
						<hlm-input-otp-group
							class="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl"
						>
							<hlm-input-otp-slot index="0" />
							<hlm-input-otp-slot index="1" />
							<hlm-input-otp-slot index="2" />
						</hlm-input-otp-group>
						<hlm-input-otp-separator />
						<hlm-input-otp-group
							class="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl"
						>
							<hlm-input-otp-slot index="3" />
							<hlm-input-otp-slot index="4" />
							<hlm-input-otp-slot index="5" />
						</hlm-input-otp-group>
					</brn-input-otp>
					<hlm-field-description>
						<a href="#">I no longer have access to this email address.</a>
					</hlm-field-description>
				</hlm-field>
			</form>
			<hlm-card-footer>
				<hlm-field>
					<button type="submit" form="otp-form" hlmBtn [disabled]="form().invalid()">Verify</button>
					<div class="text-muted-foreground text-sm">
						Having trouble signing in?
						<a href="#" class="hover:text-primary underline underline-offset-4 transition-colors">Contact support</a>
					</div>
				</hlm-field>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class InputOtpFormExample implements OnDestroy {
	private _intervalId?: NodeJS.Timeout;

	public readonly countdown = signal(60);
	public readonly isResendDisabled = computed(() => this.countdown() > 0);

	public maxLength = 6;

	/** Overrides global formatDate  */
	public transformPaste = (pastedText: string) => pastedText.replaceAll('-', '');

	private readonly _model = signal({
		otp: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.otp, { message: 'OTP is required' });
			minLength(schemaPath.otp, this.maxLength, { message: `OTP must be ${this.maxLength} characters` });
			maxLength(schemaPath.otp, this.maxLength, { message: `OTP must be ${this.maxLength} characters` });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
					toast('OTP submitted', {
						description: `Your OTP ${model.otp} has been submitted`,
					});
				},
			},
		},
	);

	constructor() {
		afterNextRender(() => this.startCountdown());
	}

	submit() {
		submit(this.form);
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
