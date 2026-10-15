import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmCodeBlockImports } from '@spartan-ng/helm/code-block';

@Component({
	selector: 'spartan-code-block-rtl-preview',
	imports: [HlmCodeBlockImports],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-md',
		'[dir]': '_dir()',
	},
	template: `
		<p class="text-muted-foreground mb-4 text-sm">{{ _t()['intro'] }}</p>
		<hlm-code-block>
			<hlm-code-block-header>
				<hlm-code-block-title>{{ _t()['title'] }}</hlm-code-block-title>
				<hlm-code-block-actions>
					<button hlmCodeBlockCopyButton [value]="_output"></button>
				</hlm-code-block-actions>
			</hlm-code-block-header>
			<pre hlmCodeBlockContent [code]="_output"></pre>
		</hlm-code-block>
	`,
})
export class CodeBlockRtlPreview {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				intro: 'Install the packages, then run the dev server.',
				title: 'Terminal',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				intro: 'ثبّت الحزم، ثم شغّل خادم التطوير.',
				title: 'الطرفية',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				intro: 'התקן את החבילות, ואז הפעל את שרת הפיתוח.',
				title: 'מסוף',
			},
		},
	};

	protected readonly _output = `pnpm add ai @ai-sdk/react zod
pnpm dev`;

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
