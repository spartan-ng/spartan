import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-rtl-preview',
	imports: [HlmButtonImports, HlmTooltipImports],
	providers: [Directionality],
	host: {
		class: 'flex w-full flex-wrap items-center justify-center gap-3',
		'[dir]': '_dir()',
	},
	template: `
		<button [hlmTooltip]="_t()['save']" position="top" hlmBtn variant="outline">{{ _t()['top'] }}</button>
		<button [hlmTooltip]="_t()['save']" position="bottom" hlmBtn variant="outline">{{ _t()['bottom'] }}</button>
		<button [hlmTooltip]="_t()['save']" position="left" hlmBtn variant="outline">{{ _t()['left'] }}</button>
		<button [hlmTooltip]="_t()['save']" position="right" hlmBtn variant="outline">{{ _t()['right'] }}</button>
	`,
})
export class TooltipRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: { save: 'Save your changes', top: 'Top', bottom: 'Bottom', left: 'Left', right: 'Right' },
		},
		ar: {
			dir: 'rtl',
			values: { save: 'احفظ تغييراتك', top: 'أعلى', bottom: 'أسفل', left: 'يسار', right: 'يمين' },
		},
		he: {
			dir: 'rtl',
			values: { save: 'שמור את השינויים שלך', top: 'למעלה', bottom: 'למטה', left: 'שמאל', right: 'ימין' },
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
