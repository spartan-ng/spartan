import { Directive } from '@angular/core';
import { injectBrnCalendarMonth } from './brn-calendar-month';
import { injectBrnCalendar } from './brn-calendar.token';

@Directive({
	selector: '[brnCalendarGrid]',
	exportAs: 'brnCalendarGrid',
	host: {
		role: 'grid',
		'[attr.aria-labelledby]': '(_month?.header() ?? _calendar.header())?.id()',
	},
})
export class BrnCalendarGrid<T> {
	/** Access the calendar component */
	protected readonly _calendar = injectBrnCalendar<T>();

	/** Access the month this grid belongs to, if rendering multiple months */
	protected readonly _month = injectBrnCalendarMonth<T>();
}
