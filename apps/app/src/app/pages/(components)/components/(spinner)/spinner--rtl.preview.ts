import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmItemImports } from '@spartan-ng/helm/item';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
	selector: 'spartan-spinner-rtl',
	imports: [HlmSpinnerImports, HlmItemImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
			<hlm-item variant="muted" [dir]="_dir()">
				<hlm-item-media>
					<hlm-spinner />
				</hlm-item-media>
				<hlm-item-content>
					<hlm-item-title>{{ _t()['title'] }}</hlm-item-title>
				</hlm-item-content>
				<hlm-item-content class="flex-none justify-end">
					<span class="text-sm tabular-nums">{{ _t()['amount'] }}</span>
				</hlm-item-content>
			</hlm-item>
		</div>
	`,
})
export class SpartanSpinnerRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				title: 'Processing payment...',
				amount: '$100.00',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				title: 'جاري معالجة الدفع...',
				amount: '١٠٠.٠٠ دولار',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				title: 'מעבד תשלום...',
				amount: '$100.00',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
