import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';

@Component({
	selector: 'spartan-carousel-rtl-preview',
	imports: [HlmCarouselImports, HlmCardImports],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full items-center justify-center p-4',
		'[dir]': '_dir()',
	},
	template: `
		<hlm-carousel class="w-full max-w-48 sm:max-w-xs">
			<hlm-carousel-content>
				@for (item of items; track item) {
					<hlm-carousel-item>
						<div class="p-1">
							<section hlmCard>
								<p hlmCardContent class="flex aspect-square items-center justify-center p-6">
									<span class="text-4xl font-semibold">{{ _t()['slide'] }} {{ item }}</span>
								</p>
							</section>
						</div>
					</hlm-carousel-item>
				}
			</hlm-carousel-content>
			<button hlm-carousel-previous></button>
			<button hlm-carousel-next></button>
		</hlm-carousel>
	`,
})
export class CarouselRtlPreview {
	private readonly _directionality = inject(Directionality);
	private readonly _language = inject(TranslateService).language;
	public items = Array.from({ length: 5 }, (_, i) => i + 1);

	private readonly _translations: Translations = {
		en: { dir: 'ltr', values: { slide: 'Slide' } },
		ar: { dir: 'rtl', values: { slide: 'شريحة' } },
		he: { dir: 'rtl', values: { slide: 'שקופית' } },
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
