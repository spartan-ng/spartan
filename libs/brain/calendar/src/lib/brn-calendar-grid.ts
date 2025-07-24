import { Directive } from '@angular/core';
import { injectBrnCalendar } from './brn-calendar.token';

@Directive({
	selector: '[brnCalendarGrid]',
	host: {
		role: 'grid',
		'[attr.aria-labelledby]': '_calendar.header()?.id()',
	},
})
export class BrnCalendarGrid<T> {
	/** Access the calendar component */
	protected readonly _calendar = injectBrnCalendar<T>();
}
