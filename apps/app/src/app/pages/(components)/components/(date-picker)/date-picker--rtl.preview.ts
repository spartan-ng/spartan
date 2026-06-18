import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, Translations } from '@spartan-ng/app/app/shared/translate.service';
import {
	type BrnCalendarI18n,
	injectBrnCalendarI18n,
	type MonthLabels,
	provideBrnCalendarI18n,
} from '@spartan-ng/brain/calendar';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { DateTime } from 'luxon';

export const CALENDAR_I18N: Record<'en' | 'ar' | 'he', BrnCalendarI18n> = {
	en: {
		formatWeekdayName: (i) => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i],
		months: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as MonthLabels,
		years: (startYear = 1925, endYear = new Date().getFullYear() + 1) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month, year) => new Date(year, month).toLocaleDateString('en', { month: 'long', year: 'numeric' }),
		formatMonth: (m) => new Date(2000, m).toLocaleDateString('en', { month: 'short' }),
		formatYear: (y) => `${y}`,
		labelPrevious: () => 'Previous month',
		labelNext: () => 'Next month',
		labelWeekday: (i) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
		firstDayOfWeek: () => 0,
	},
	ar: {
		formatWeekdayName: (i) => ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'][i],
		months: () =>
			[
				'يناير',
				'فبراير',
				'مارس',
				'أبريل',
				'مايو',
				'يونيو',
				'يوليو',
				'أغسطس',
				'سبتمبر',
				'أكتوبر',
				'نوفمبر',
				'ديسمبر',
			] as MonthLabels,
		years: (startYear = 1925, endYear = new Date().getFullYear() + 1) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month, year) => new Date(year, month).toLocaleDateString('ar', { month: 'long', year: 'numeric' }),
		formatMonth: (m) => new Date(2000, m).toLocaleDateString('ar', { month: 'short' }),
		formatYear: (y) => `${y}`,
		labelPrevious: () => 'الشهر السابق',
		labelNext: () => 'الشهر التالي',
		labelWeekday: (i) => ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][i],
		firstDayOfWeek: () => 6,
	},
	he: {
		formatWeekdayName: (i) => ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'][i],
		months: () =>
			[
				'ינואר',
				'פברואר',
				'מרץ',
				'אפריל',
				'מאי',
				'יוני',
				'יולי',
				'אוגוסט',
				'ספטמבר',
				'אוקטובר',
				'נובמבר',
				'דצמבר',
			] as MonthLabels,
		years: (startYear = 1925, endYear = new Date().getFullYear() + 1) =>
			Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
		formatHeader: (month, year) => new Date(year, month).toLocaleDateString('he', { month: 'long', year: 'numeric' }),
		formatMonth: (m) => new Date(2000, m).toLocaleDateString('he', { month: 'short' }),
		formatYear: (y) => `${y}`,
		labelPrevious: () => 'החודש הקודם',
		labelNext: () => 'החודש הבא',
		labelWeekday: (i) => ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][i],
		firstDayOfWeek: () => 0,
	},
} as const;

@Component({
	selector: 'spartan-date-picker-rtl',
	imports: [HlmDatePickerImports, HlmFieldImports],
	providers: [provideBrnCalendarI18n()],
	template: `
		<hlm-field [dir]="_dir()">
			<hlm-date-picker [min]="minDate" [max]="maxDate" [formatDate]="_formatDate()">
				<hlm-date-picker-trigger buttonId="date">{{ _t()['placeholder'] }}</hlm-date-picker-trigger>
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class DatePickerRtl {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	private readonly _language = inject(TranslateService).language;
	private readonly _calendarI18n = injectBrnCalendarI18n();

	constructor() {
		effect(() => {
			const language = this._language();
			untracked(() => this._calendarI18n.use(CALENDAR_I18N[language]));
		});
	}

	protected readonly _formatDate = computed(() => {
		const locale = this._language();
		return (date: Date) => DateTime.fromJSDate(date).setLocale(locale).toLocaleString(DateTime.DATE_FULL);
	});

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				placeholder: 'Pick a date',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				placeholder: 'اختر تاريخًا',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				placeholder: 'בחר תאריך',
			},
		},
	};

	private readonly _translation = computed(() => this._translations[this._language()]);
	protected readonly _t = computed(() => this._translation().values);
	protected readonly _dir = computed(() => this._translation().dir);
}
