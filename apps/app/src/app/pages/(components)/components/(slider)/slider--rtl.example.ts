import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-slider-rtl-preview',
	imports: [HlmLabel, HlmSliderImports],
	providers: [Directionality],
	host: {
		class: 'grid w-full max-w-sm gap-3',
		'[dir]': '_dir()',
	},
	template: `
		<label hlmLabel>{{ _t()['volume'] }}</label>
		<hlm-slider [(value)]="_value" />
	`,
})
export class SliderRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;
	protected readonly _value = signal([60]);

	private readonly _translations: Translations = {
		en: { dir: 'ltr', values: { volume: 'Volume' } },
		ar: { dir: 'rtl', values: { volume: 'مستوى الصوت' } },
		he: { dir: 'rtl', values: { volume: 'עוצמת קול' } },
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
