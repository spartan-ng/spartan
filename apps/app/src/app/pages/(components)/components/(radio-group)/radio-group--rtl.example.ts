import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';

@Component({
	selector: 'spartan-radio-group-rtl-preview',
	imports: [FormsModule, HlmRadioGroupImports, HlmLabelImports],
	providers: [Directionality],
	host: {
		class: 'grid w-full max-w-sm gap-3',
		'[dir]': '_dir()',
	},
	template: `
		<label hlmLabel>{{ _t()['label'] }}</label>
		<hlm-radio-group [(ngModel)]="_value">
			<div class="flex items-center gap-3">
				<hlm-radio value="default" inputId="rtl-r1">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="rtl-r1">{{ _t()['default'] }}</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="comfortable" inputId="rtl-r2">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="rtl-r2">{{ _t()['comfortable'] }}</label>
			</div>
			<div class="flex items-center gap-3">
				<hlm-radio value="compact" inputId="rtl-r3">
					<hlm-radio-indicator indicator />
				</hlm-radio>
				<label hlmLabel for="rtl-r3">{{ _t()['compact'] }}</label>
			</div>
		</hlm-radio-group>
	`,
})
export class RadioGroupRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;
	protected _value = 'comfortable';

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: { label: 'Spacing', default: 'Default', comfortable: 'Comfortable', compact: 'Compact' },
		},
		ar: {
			dir: 'rtl',
			values: { label: 'التباعد', default: 'افتراضي', comfortable: 'مريح', compact: 'مضغوط' },
		},
		he: {
			dir: 'rtl',
			values: { label: 'מרווח', default: 'ברירת מחדל', comfortable: 'נוח', compact: 'קומפקטי' },
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);

	constructor() {
		effect(() => {
			const dir = this._dir();
			untracked(() => this._directionality.valueSignal.set(dir));
		});
	}
}
