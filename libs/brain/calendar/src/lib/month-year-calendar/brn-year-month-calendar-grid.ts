import { Directive } from '@angular/core';
import { injectBrnYearMonthCalendar } from './brn-year-month-calendar.token';

@Directive({
	selector: '[brnYearMonthCalendarGrid]',
	host: {
		role: 'grid',
		'[attr.aria-labelledby]': '_yearMonth.header()?.id()',
	},
})
export class BrnYearMonthCalendarGrid<T> {
	/** Access the month/year selector */
	protected readonly _yearMonth = injectBrnYearMonthCalendar<T>();
}
