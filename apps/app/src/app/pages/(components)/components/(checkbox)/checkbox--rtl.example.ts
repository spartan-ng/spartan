import { Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-checkbox-rtl-preview',
	imports: [HlmLabelImports, HlmCheckboxImports],
	host: {
		class: 'flex flex-col gap-4',
		'[dir]': '_dir()',
	},
	template: `
		@for (item of _items; track item.id) {
			<div class="flex items-center gap-3">
				<hlm-checkbox [inputId]="item.id" [checked]="item.checked" />
				<label hlmLabel [for]="item.id">{{ _t()[item.labelKey] }}</label>
			</div>
		}
	`,
})
export class CheckboxRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				terms: 'Accept terms and conditions',
				newsletter: 'Subscribe to the newsletter',
				notifications: 'Enable notifications',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				terms: 'أوافق على الشروط والأحكام',
				newsletter: 'الاشتراك في النشرة الإخبارية',
				notifications: 'تفعيل الإشعارات',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				terms: 'אני מסכים לתנאים ולהגבלות',
				newsletter: 'הירשם לניוזלטר',
				notifications: 'הפעל התראות',
			},
		},
	};

	protected readonly _items = [
		{ id: 'rtl-terms', labelKey: 'terms' as const, checked: true },
		{ id: 'rtl-newsletter', labelKey: 'newsletter' as const, checked: false },
		{ id: 'rtl-notifications', labelKey: 'notifications' as const, checked: false },
	];

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
