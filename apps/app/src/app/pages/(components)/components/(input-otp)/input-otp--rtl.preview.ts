import { Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { BrnInputOtpImports } from '@spartan-ng/brain/input-otp';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';

@Component({
	selector: 'spartan-input-otp-rtl',
	imports: [HlmFieldImports, HlmInputOtpImports, BrnInputOtpImports],
	template: `
		<hlm-field class="mx-auto max-w-xs" [dir]="_dir()">
			<label hlmFieldLabel for="input-otp-rtl">{{ _t()['verificationCode'] }}</label>
			<brn-input-otp
				inputId="input-otp-rtl"
				hlmInputOtp
				value="123456"
				maxLength="6"
				inputClass="disabled:cursor-not-allowed"
			>
				<hlm-input-otp-group>
					<hlm-input-otp-slot index="0" />
					<hlm-input-otp-slot index="1" />
					<hlm-input-otp-slot index="2" />
					<hlm-input-otp-slot index="3" />
					<hlm-input-otp-slot index="4" />
					<hlm-input-otp-slot index="5" />
				</hlm-input-otp-group>
			</brn-input-otp>
		</hlm-field>
	`,
})
export class InputOtpRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				verificationCode: 'Verification code',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				verificationCode: 'رمز التحقق',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				verificationCode: 'קוד אימות',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
