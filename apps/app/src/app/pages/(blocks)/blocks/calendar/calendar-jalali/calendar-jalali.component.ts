import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type BrnCalendarI18n, type MonthLabels, provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { BrnJalaliDateAdapter, provideDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

const JALALI_MONTHS = [
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
] as MonthLabels;

const JALALI_CALENDAR_I18N: BrnCalendarI18n = {
	formatWeekdayName: (i) => ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'][i],
	months: () => JALALI_MONTHS,
	years: (startYear = 1300, endYear = 1420) => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
	formatHeader: (month, year) => JALALI_MONTHS[month] + ` ${year}`,
	formatMonth: (m) => JALALI_MONTHS[m],
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center items-start p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<div dir="rtl">
			<hlm-calendar class="bg-background" />
		</div>
	`,
})
export class CalendarJalaliBlockComponent {}
