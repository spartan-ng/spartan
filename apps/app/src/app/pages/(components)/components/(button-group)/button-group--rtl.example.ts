import { Component, computed, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
	lucideArchive,
	lucideArrowLeft,
	lucideCalendarPlus,
	lucideChevronRight,
	lucideClock,
	lucideEllipsis,
	lucideListFilterPlus,
	lucideMailCheck,
	lucideTag,
	lucideTrash,
} from '@ng-icons/lucide';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-button-group-rtl-preview',
	imports: [HlmIconImports, HlmButtonImports, HlmButtonGroupImports, HlmDropdownMenuImports],
	providers: [
		provideIcons({
			lucideArrowLeft,
			lucideEllipsis,
			lucideMailCheck,
			lucideArchive,
			lucideClock,
			lucideCalendarPlus,
			lucideListFilterPlus,
			lucideTag,
			lucideTrash,
			lucideChevronRight,
		}),
	],
	host: {
		'[dir]': '_dir()',
	},
	template: `
		<div hlmButtonGroup>
			<div hlmButtonGroup class="hidden sm:flex">
				<button hlmBtn variant="outline" size="icon" [attr.aria-label]="_t().goBack">
					<ng-icon name="lucideArrowLeft" />
				</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">{{ _t().archive }}</button>
				<button hlmBtn variant="outline">{{ _t().report }}</button>
			</div>
			<div hlmButtonGroup>
				<button hlmBtn variant="outline">{{ _t().snooze }}</button>
				<button
					hlmBtn
					variant="outline"
					[attr.aria-label]="_t().moreOptions"
					[hlmDropdownMenuTrigger]="menu"
					align="end"
				>
					<ng-icon name="lucideEllipsis" />
				</button>
			</div>
		</div>
		<ng-template #menu>
			<hlm-dropdown-menu class="w-52" [dir]="_dir()">
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideMailCheck" size="sm" />
						<span>{{ _t().markAsRead }}</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideArchive" size="sm" />
						<span>{{ _t().archive }}</span>
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideClock" size="sm" />
						<span>{{ _t().snooze }}</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideCalendarPlus" size="sm" />
						<span>{{ _t().addToCalendar }}</span>
					</button>
					<button hlmDropdownMenuItem>
						<ng-icon hlm name="lucideListFilterPlus" size="sm" />
						<span>{{ _t().addToList }}</span>
					</button>
					<button
						hlmDropdownMenuItem
						class="flex justify-between"
						align="start"
						[side]="_dir() === 'ltr' ? 'right' : 'left'"
						[hlmDropdownMenuTrigger]="submenu"
					>
						<div class="flex items-center gap-2">
							<ng-icon hlm name="lucideTag" size="sm" />
							<span>{{ _t().labelAs }}</span>
						</div>
						<ng-icon hlm name="lucideChevronRight" size="sm" />
					</button>
				</hlm-dropdown-menu-group>
				<hlm-dropdown-menu-separator />
				<hlm-dropdown-menu-group>
					<button
						hlmDropdownMenuItem
						variant="destructive"
						class="hover:bg-destructive/10 dark:hover:bg-destructive/40"
					>
						<ng-icon hlm name="lucideTrash" size="sm" />
						<span>{{ _t().delete }}</span>
					</button>
				</hlm-dropdown-menu-group>
			</hlm-dropdown-menu>
		</ng-template>
		<ng-template #submenu>
			<hlm-dropdown-menu-sub class="w-40" [dir]="_dir()">
				<button hlmDropdownMenuRadio [checked]="label() === 'personal'" (click)="label.set('personal')">
					<hlm-dropdown-menu-radio-indicator />
					<span>{{ _t().personal }}</span>
				</button>
				<button hlmDropdownMenuRadio [checked]="label() === 'work'" (click)="label.set('work')">
					<hlm-dropdown-menu-radio-indicator />
					<span>{{ _t().work }}</span>
				</button>
				<button hlmDropdownMenuRadio [checked]="label() === 'other'" (click)="label.set('other')">
					<hlm-dropdown-menu-radio-indicator />
					<span>{{ _t().other }}</span>
				</button>
			</hlm-dropdown-menu-sub>
		</ng-template>
	`,
})
export class ButtonGroupRtl {
	private readonly _language = inject(TranslateService).language;
	private readonly _translations: Translations<{
		goBack: string;
		archive: string;
		report: string;
		snooze: string;
		moreOptions: string;
		markAsRead: string;
		addToCalendar: string;
		addToList: string;
		labelAs: string;
		delete: string;
		personal: string;
		work: string;
		other: string;
	}> = {
		en: {
			dir: 'ltr',
			values: {
				goBack: 'Go Back',
				archive: 'Archive',
				report: 'Report',
				snooze: 'Snooze',
				moreOptions: 'More Options',
				markAsRead: 'Mark as Read',
				addToCalendar: 'Add to Calendar',
				addToList: 'Add to List',
				labelAs: 'Label as...',
				delete: 'Delete',
				personal: 'Personal',
				work: 'Work',
				other: 'Other',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				goBack: 'رجوع',
				archive: 'أرشفة',
				report: 'إبلاغ',
				snooze: 'تأجيل',
				moreOptions: 'المزيد من الخيارات',
				markAsRead: 'تحديد كمقروء',
				addToCalendar: 'إضافة إلى التقويم',
				addToList: 'إضافة إلى القائمة',
				labelAs: 'تصنيف كـ...',
				delete: 'حذف',
				personal: 'شخصي',
				work: 'عمل',
				other: 'آخر',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				goBack: 'חזור',
				archive: 'ארכיון',
				report: 'דווח',
				snooze: 'דחה',
				moreOptions: 'אפשרויות נוספות',
				markAsRead: 'סמן כנקרא',
				addToCalendar: 'הוסף ליומן',
				addToList: 'הוסף לרשימה',
				labelAs: 'תייג כ...',
				delete: 'מחק',
				personal: 'אישי',
				work: 'עבודה',
				other: 'אחר',
			},
		},
	};

	public readonly label = signal('personal');

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
