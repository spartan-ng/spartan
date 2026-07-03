import { Directive } from '@angular/core';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: '[brnMonthYearCalendarGrid]',
	host: {
		role: 'grid',
		'[attr.aria-labelledby]': '_monthYear.header()?.id()',
	},
})
export class BrnMonthYearCalendarGrid<T> {
	/** Access the month/year selector */
	protected readonly _monthYear = injectBrnMonthYearCalendar<T>();
}
