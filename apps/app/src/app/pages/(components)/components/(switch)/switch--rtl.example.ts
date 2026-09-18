import { Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-rtl-preview',
	imports: [HlmFieldImports, HlmSwitch],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<hlm-field orientation="horizontal" class="max-w-sm">
			<hlm-field-content>
				<label hlmFieldLabel for="switch-focus-mode-rtl">{{ _t()['label'] }}</label>
				<p hlmFieldDescription>{{ _t()['description'] }}</p>
			</hlm-field-content>
			<hlm-switch inputId="switch-focus-mode-rtl" />
		</hlm-field>
	`,
})
export class SwitchRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				label: 'Share across devices',
				description: 'Focus is shared across devices, and turns off when you leave the app.',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				label: 'المشاركة عبر الأجهزة',
				description: 'يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة التطبيق.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				label: 'שיתוף בין מכשירים',
				description: 'המיקוד משותף בין מכשירים, וכבה כשאתה עוזב את האפליקציה.',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
