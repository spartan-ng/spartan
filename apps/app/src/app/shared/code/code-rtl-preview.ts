import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { TranslateService } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'div[spartanRtlCodePreview]',
	imports: [HlmSelectImports, NgIcon, HlmPopoverImports, HlmSeparator, HlmButtonImports],
	providers: [
		provideIcons({
			lucideInfo,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="border-border flex flex-row items-center justify-between border-b p-4">
			<hlm-select class="inline-block" [(value)]="_languageService.language" [itemToString]="itemToString">
				<hlm-select-trigger class="w-52">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						@for (language of languages; track language.value) {
							<hlm-select-item [value]="language.value">
								{{ language.label }}
							</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>

			<hlm-popover align="end">
				<button hlmPopoverTrigger hlmBtn variant="ghost">
					<ng-icon name="lucideInfo" />
				</button>
				<hlm-popover-content *hlmPopoverPortal="let ctx" class="flex w-56 flex-col gap-2.5 text-xs">
					<div>
						I used AI to translate the text for demonstration purposes. It&apos;s not perfect and may contain errors.
					</div>
					<hlm-separator class="-mx-2.5 w-auto!" />
					<div data-lang="ar">
						لقد استخدمت الذكاء الاصطناعي لترجمة النص للأغراض التجريبية فقط. قد لا تكون الترجمة دقيقة وقد تحتوي على
						أخطاء.
					</div>
					<hlm-separator class="-mx-2.5 w-auto!" />
					<div data-lang="he">
						השתמשתי בבינה מלאכותית כדי לתרגם את הטקסט למטרות הדגמה. זה לא מושלם ויכול להכיל שגיאות.
					</div>
				</hlm-popover-content>
			</hlm-popover>
		</div>
		<div
			class="preview flex min-h-[350px] w-full items-center justify-center px-4 py-10 lg:px-10"
			[attr.data-lang]="_languageService.language()"
		>
			<ng-content />
		</div>
	`,
})
export class CodeRtlPreview {
	protected readonly _languageService = inject(TranslateService);

	public languages = [
		{ value: 'en', label: 'English' },
		{ value: 'ar', label: 'Arabic (العربية)' },
		{ value: 'he', label: 'Hebrew (עברית)' },
	];

	public itemToString = (value: string) => this.languages.find((lang) => lang.value === value)?.label ?? '';
}
