import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type BrnCalendarI18n, type MonthLabels, provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { BrnLunarDateAdapter, provideDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

const LUNAR_MONTHS = [
	'Muharram',
	'Safar',
	"Rabi' al-Awwal",
	"Rabi' al-Thani",
	'Jumada al-Awwal',
	'Jumada al-Thani',
	'Rajab',
	"Sha'ban",
	'Ramadan',
	'Shawwal',
	"Dhu al-Qi'dah",
	'Dhu al-Hijjah',
] as MonthLabels;

const LUNAR_CALENDAR_I18N: BrnCalendarI18n = {
	formatWeekdayName: (i) => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][i],
	months: () => LUNAR_MONTHS,
	years: (startYear = 1440, endYear = 1460) => Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
	formatHeader: (month, year) => LUNAR_MONTHS[month] + ` ${year}`,
	formatMonth: (m) => LUNAR_MONTHS[m],
	formatYear: (y) => `${y}`,
	labelPrevious: () => 'Previous month',
	labelNext: () => 'Next month',
	labelWeekday: (i) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
	firstDayOfWeek: () => 0,
};

@Component({
	selector: 'spartan-calendar-lunar',
	imports: [HlmCalendar],
	providers: [provideDateAdapter(BrnLunarDateAdapter), provideBrnCalendarI18n(LUNAR_CALENDAR_I18N)],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center items-start p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<div>
			<hlm-calendar class="bg-background" />
		</div>
	`,
})
export class CalendarLunarBlockComponent {}
