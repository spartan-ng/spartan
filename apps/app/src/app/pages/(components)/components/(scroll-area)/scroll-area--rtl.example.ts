import { Directionality } from '@angular/cdk/bidi';
import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
	selector: 'spartan-scroll-area-rtl-preview',
	imports: [HlmScrollAreaImports, NgScrollbarModule],
	providers: [Directionality],
	host: {
		class: 'flex w-full justify-center',
		'[dir]': '_dir()',
	},
	template: `
		<div class="w-96 max-w-full space-y-3">
			<h4 class="text-sm leading-none font-medium">{{ _t()['title'] }}</h4>
			<ng-scrollbar hlm class="w-full border whitespace-nowrap">
				<div class="flex w-max gap-3 p-4">
					@for (item of _items; track item) {
						<div class="bg-muted flex size-20 shrink-0 items-center justify-center rounded-md text-lg font-semibold">
							{{ item }}
						</div>
					}
				</div>
			</ng-scrollbar>
		</div>
	`,
})
export class ScrollAreaRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;
	protected readonly _items = Array.from({ length: 12 }, (_, i) => i + 1);

	private readonly _translations: Translations = {
		en: { dir: 'ltr', values: { title: 'Scroll horizontally' } },
		ar: { dir: 'rtl', values: { title: 'مرر أفقيًا' } },
		he: { dir: 'rtl', values: { title: 'גלול אופקית' } },
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
