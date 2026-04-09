import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBookmark } from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

@Component({
	selector: 'spartan-badge-rtl',
	imports: [HlmBadgeImports, NgIcon],
	providers: [provideIcons({ lucideBadgeCheck, lucideBookmark })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full flex-wrap justify-center gap-2" [dir]="_dir()">
			<span hlmBadge>{{ _t()['badge'] }}</span>
			<span hlmBadge variant="secondary">{{ _t()['secondary'] }}</span>
			<span hlmBadge variant="destructive">{{ _t()['destructive'] }}</span>
			<span hlmBadge variant="outline">{{ _t()['outline'] }}</span>
			<span hlmBadge variant="secondary">
				<ng-icon name="lucideBadgeCheck" />
				{{ _t()['verified'] }}
			</span>
			<span hlmBadge variant="outline">
				{{ _t()['bookmark'] }}
				<ng-icon name="lucideBookmark" />
			</span>
		</div>
	`,
})
export class BadgeRtl {
	private readonly _language = inject(TranslateService).language;

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				badge: 'Badge',
				secondary: 'Secondary',
				destructive: 'Destructive',
				outline: 'Outline',
				verified: 'Verified',
				bookmark: 'Bookmark',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				badge: 'شارة',
				secondary: 'ثانوي',
				destructive: 'مدمر',
				outline: 'مخطط',
				verified: 'متحقق',
				bookmark: 'إشارة مرجعية',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				badge: 'תג',
				secondary: 'משני',
				destructive: 'הרסני',
				outline: 'קווי מתאר',
				verified: 'מאומת',
				bookmark: 'סימנייה',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
