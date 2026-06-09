import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmProgressImports } from '@spartan-ng/helm/progress';

@Component({
	selector: 'spartan-progress-rtl-preview',
	imports: [HlmLabel, HlmProgressImports],
	providers: [Directionality],
	host: {
		class: 'grid w-full max-w-sm gap-3',
		'[dir]': '_dir()',
	},
	template: `
		<label hlmLabel>{{ _t()['downloading'] }}</label>
		<hlm-progress [value]="60">
			<hlm-progress-indicator />
		</hlm-progress>
	`,
})
export class ProgressRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: { dir: 'ltr', values: { downloading: 'Downloading…' } },
		ar: { dir: 'rtl', values: { downloading: '…جارٍ التنزيل' } },
		he: { dir: 'rtl', values: { downloading: '…מוריד' } },
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
