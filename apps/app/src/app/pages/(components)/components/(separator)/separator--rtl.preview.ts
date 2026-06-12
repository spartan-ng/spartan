import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
	selector: 'spartan-separator-rtl',
	imports: [HlmSeparatorImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex max-w-sm flex-col gap-4 text-sm" [dir]="_dir()">
			<div class="flex flex-col gap-1.5">
				<div class="leading-none font-medium">{{ _t()['title'] }}</div>
				<div class="text-muted-foreground">{{ _t()['subtitle'] }}</div>
			</div>
			<hlm-separator />
			<div>{{ _t()['description'] }}</div>
		</div>
	`,
})
export class SeparatorRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				title: 'spartan/ui',
				subtitle: 'The Foundation for your Design System',
				description: 'A set of beautifully designed components that you can customize, extend, and build on.',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				title: 'spartan/ui',
				subtitle: 'الأساس لنظام التصميم الخاص بك',
				description: 'مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء عليها.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				title: 'spartan/ui',
				subtitle: 'הבסיס למערכת העיצוב שלך',
				description: 'סט של רכיבים מעוצבים בצורה יפה שאתה יכול להתאים אישית, להרחיב ולבנות עליהם.',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
