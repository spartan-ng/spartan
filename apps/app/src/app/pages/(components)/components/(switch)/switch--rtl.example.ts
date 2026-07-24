import { Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-rtl-preview',
	imports: [HlmLabel, HlmSwitch],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" [checked]="true" />
			{{ _t()['airplaneMode'] }}
		</label>
	`,
})
export class SwitchRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: { dir: 'ltr', values: { airplaneMode: 'Airplane mode' } },
		ar: { dir: 'rtl', values: { airplaneMode: 'وضع الطيران' } },
		he: { dir: 'rtl', values: { airplaneMode: 'מצב טיסה' } },
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
