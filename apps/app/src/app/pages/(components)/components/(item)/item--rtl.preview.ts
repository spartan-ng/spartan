import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmItemImports } from '@spartan-ng/helm/item';

@Component({
	selector: 'spartan-item-rtl-preview',
	imports: [HlmItemImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex w-full max-w-md flex-col gap-6',
		'[dir]': '_dir()',
	},
	template: `
		<hlm-item variant="outline">
			<hlm-item-content>
				<hlm-item-title>{{ _t()['basicItem'] }}</hlm-item-title>
				<p hlmItemDescription>{{ _t()['basicItemDesc'] }}</p>
			</hlm-item-content>
			<hlm-item-actions>
				<button hlmBtn variant="outline" size="sm">{{ _t()['action'] }}</button>
			</hlm-item-actions>
		</hlm-item>
		<a hlmItem href="#" variant="outline" size="sm">
			<hlm-item-media>
				<ng-icon name="lucideBadgeCheck" class="text-[calc(var(--spacing)*5)]" />
			</hlm-item-media>
			<hlm-item-content>
				<hlm-item-title>{{ _t()['verifiedTitle'] }}</hlm-item-title>
			</hlm-item-content>
			<hlm-item-actions>
				<ng-icon name="lucideChevronRight" class="text-[calc(var(--spacing)*4)]" />
			</hlm-item-actions>
		</a>
	`,
})
export class ItemRtlPreview {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				basicItem: 'Basic Item',
				basicItemDesc: 'A simple item with title and description.',
				action: 'Action',
				verifiedTitle: 'Your profile has been verified.',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				basicItem: 'عنصر أساسي',
				basicItemDesc: 'عنصر بسيط يحتوي على عنوان ووصف.',
				action: 'إجراء',
				verifiedTitle: 'تم التحقق من ملفك الشخصي.',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				basicItem: 'פריט בסיסי',
				basicItemDesc: 'פריט פשוט עם כותרת ותיאור.',
				action: 'פעולה',
				verifiedTitle: 'הפרופיל שלך אומת.',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
