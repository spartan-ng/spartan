import { Component } from '@angular/core';
import { provideBrnCalendarI18n, type BrnCalendarI18n, type MonthLabels } from '@spartan-ng/brain/calendar';
import { BrnJalaliDateAdapter, provideDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

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

@Component({
	selector: 'spartan-calendar-jalali',
	imports: [HlmCalendar],
	providers: [provideDateAdapter(BrnJalaliDateAdapter), provideBrnCalendarI18n(JALALI_CALENDAR_I18N)],
	template: `
		<div dir="rtl">
			<hlm-calendar />
		</div>
	`,
})
export class CalendarJalaliExample {}
