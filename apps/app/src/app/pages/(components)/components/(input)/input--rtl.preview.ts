import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-rtl',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field [dir]="_dir()">
			<label hlmFieldLabel for="input-rtl-api-key">{{ _t()['apiKey'] }}</label>
			<input hlmInput id="input-rtl-api-key" type="password" [placeholder]="_t()['placeholder']" />
			<hlm-field-description>{{ _t()['description'] }}</hlm-field-description>
		</hlm-field>
	`,
})
export class InputRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				apiKey: 'API Key',
				placeholder: 'sk-...',
				description: 'Your API key is encrypted and stored securely.',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				apiKey: 'مفتاح API',
				placeholder: 'sk-...',
				description: 'مفتاح API الخاص بك مشفر ومخزن بأمان.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				apiKey: 'מפתח API',
				placeholder: 'sk-...',
				description: 'מפתח ה-API שלך מוצפן ונשמר בצורה מאובטחת.',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
