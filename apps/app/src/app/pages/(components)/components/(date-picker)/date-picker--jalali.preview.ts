import { Component, computed, effect, inject, untracked } from '@angular/core';
import { TranslateService, type Translations } from '@spartan-ng/app/app/shared/translate.service';
import {
	injectBrnCalendarI18n,
	provideBrnCalendarI18n,
	type BrnCalendarI18n,
	type MonthLabels,
} from '@spartan-ng/brain/calendar';
import { BrnJalaliDateAdapter, JalaliDate, provideDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

const JALALI_CALENDAR_I18N: BrnCalendarI18n = {
	formatWeekdayName: (i) => ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'][i],
	months: () =>
		[
			'فروردین',
			'اردیبهشت',
			'خرداد',
			'تیر',
			'مرداد',
			'شهریور',
			'مهر',
			'آبان',
			'آذر',
			'دی',
			'بهمن',
			'اسفند',
		] as MonthLabels,
	years: (startYear = 1300, endYear = 1420) => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
	formatHeader: (month, year) =>
		['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][month] +
		` ${year}`,
	formatMonth: (m) =>
		['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'][m],
	formatYear: (y) => `${y}`,
	labelPrevious: () => 'ماه قبل',
	labelNext: () => 'ماه بعد',
	labelWeekday: (i) => ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'][i],
	firstDayOfWeek: () => 6,
};

const GREGORIAN_CALENDAR_I18N: BrnCalendarI18n = {
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
};

@Component({
	selector: 'spartan-date-picker-jalali',
	imports: [HlmDatePickerImports, HlmFieldImports],
	providers: [
		provideDateAdapter(BrnJalaliDateAdapter),
		provideBrnCalendarI18n(JALALI_CALENDAR_I18N),
		provideHlmDatePickerConfig({
			formatDate: (date: JalaliDate) =>
				`${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`,
		}),
	],
	template: `
		<hlm-field [dir]="_dir()">
			<hlm-date-picker [formatDate]="_formatDate()">
				<hlm-date-picker-trigger buttonId="date-jalali">{{ _t()['placeholder'] }}</hlm-date-picker-trigger>
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class DatePickerJalali {
	private readonly _language = inject(TranslateService).language;
	private readonly _calendarI18n = injectBrnCalendarI18n();

	constructor() {
		effect(() => {
			const language = this._language();
			untracked(() => {
				if (language === 'fa') {
					this._calendarI18n.use(JALALI_CALENDAR_I18N);
				} else {
					this._calendarI18n.use(GREGORIAN_CALENDAR_I18N);
				}
			});
		});
	}

	protected readonly _formatDate = computed(() => {
		const language = this._language();
		return (date: JalaliDate) => {
			if (language === 'fa') {
				return `${date.year}/${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}`;
			}
			return `${date.year}/${date.month}/${date.day}`;
		};
	});

	private readonly _translations: Translations = {
		en: {
			dir: 'ltr',
			values: {
				placeholder: 'Pick a date (Jalali)',
			},
		},
		ar: {
			dir: 'rtl',
			values: {
				placeholder: 'اختر تاريخًا (هجري شمسي)',
			},
		},
		he: {
			dir: 'rtl',
			values: {
				placeholder: "בחר תאריך (ג'לאלי)",
			},
		},
		fa: {
			dir: 'rtl',
			values: {
				placeholder: 'انتخاب تاریخ',
			},
		},
	};

	protected readonly _t = computed(() => this._translations[this._language()]!.values);
	protected readonly _dir = computed(() => this._translations[this._language()]!.dir);
}
