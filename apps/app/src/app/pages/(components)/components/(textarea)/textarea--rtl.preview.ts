import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-textarea-rtl',
	imports: [HlmTextareaImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field [dir]="_dir()">
			<label hlmFieldLabel for="textarea-message">{{ _t()['label'] }}</label>
			<textarea hlmTextarea id="textarea-message" [placeholder]="_t()['placeholder']"></textarea>
			<hlm-field-description>{{ _t()['description'] }}</hlm-field-description>
		</hlm-field>
	`,
})
export class TextareaRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				label: 'Feedback',
				placeholder: 'Your feedback helps us improve...',
				description: 'Share your thoughts about our service.',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				label: 'التعليقات',
				placeholder: 'تعليقاتك تساعدنا على التحسين...',
				description: 'شاركنا أفكارك حول خدمتنا.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				label: 'משוב',
				placeholder: 'המשוב שלך עוזר לנו להשתפר...',
				description: 'שתף את מחשבותיך על השירות שלנו.',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
