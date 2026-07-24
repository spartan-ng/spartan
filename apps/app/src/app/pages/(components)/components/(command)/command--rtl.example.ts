import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideCalculator,
	lucideCalendar,
	lucideCog,
	lucidePlus,
	lucideSearch,
	lucideSmile,
	lucideUser,
	lucideWallet,
} from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCommandImports } from '@spartan-ng/helm/command';

@Component({
	selector: 'spartan-command-rtl',
	imports: [HlmCommandImports, HlmCardImports, NgIcon],
	providers: [
		provideIcons({
			lucideSearch,
			lucideCalendar,
			lucideSmile,
			lucidePlus,
			lucideUser,
			lucideWallet,
			lucideCog,
			lucideCalculator,
		}),
	],
	hostDirectives: [HlmCard],
	host: {
		class: 'w-full py-0',
		'[attr.dir]': '_dir()',
	},
	template: `
		<div hlmCardContent class="p-0">
			<hlm-command>
				<hlm-command-input [placeholder]="_t()['placeholder']" />
				<hlm-command-list>
					<div *hlmCommandEmptyState hlmCommandEmpty>{{ _t()['empty'] }}</div>
					<hlm-command-group>
						<hlm-command-group-label>{{ _t()['suggestions'] }}</hlm-command-group-label>
						<button hlm-command-item value="Calendar">
							<ng-icon name="lucideCalendar" />
							{{ _t()['calendar'] }}
						</button>
						<button hlm-command-item value="Search Emoji">
							<ng-icon name="lucideSmile" />
							{{ _t()['searchEmoji'] }}
						</button>
						<button hlm-command-item value="Calculator" disabled>
							<ng-icon name="lucideCalculator" />
							{{ _t()['calculator'] }}
						</button>
					</hlm-command-group>

					<hlm-command-separator />

					<hlm-command-group>
						<hlm-command-group-label>{{ _t()['settings'] }}</hlm-command-group-label>

						<button hlm-command-item value="Profile">
							<ng-icon name="lucideUser" />
							{{ _t()['profile'] }}
							<hlm-command-shortcut>⌘P</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="Billing">
							<ng-icon name="lucideWallet" />
							{{ _t()['billing'] }}
							<hlm-command-shortcut>⌘B</hlm-command-shortcut>
						</button>
						<button hlm-command-item value="Settings">
							<ng-icon name="lucideCog" />
							{{ _t()['settings'] }}
							<hlm-command-shortcut>⌘S</hlm-command-shortcut>
						</button>
					</hlm-command-group>
				</hlm-command-list>
			</hlm-command>
		</div>
	`,
})
export class CommandRtl {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				placeholder: 'Type a command or search...',
				empty: 'No results found.',
				suggestions: 'Suggestions',
				calendar: 'Calendar',
				searchEmoji: 'Search Emoji',
				calculator: 'Calculator',
				settings: 'Settings',
				profile: 'Profile',
				billing: 'Billing',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				placeholder: 'اكتب أمرًا أو ابحث...',
				empty: 'لم يتم العثور على نتائج.',
				suggestions: 'اقتراحات',
				calendar: 'التقويم',
				searchEmoji: 'البحث عن الرموز التعبيرية',
				calculator: 'الآلة الحاسبة',
				settings: 'الإعدادات',
				profile: 'الملف الشخصي',
				billing: 'الفوترة',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				placeholder: 'הקלד פקודה או חפש...',
				empty: 'לא נמצאו תוצאות.',
				suggestions: 'הצעות',
				calendar: 'לוח שנה',
				searchEmoji: "חפש אמוג'י",
				calculator: 'מחשבון',
				settings: 'הגדרות',
				profile: 'פרופיל',
				billing: 'חיוב',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
