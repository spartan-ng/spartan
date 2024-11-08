import { Directive } from '@angular/core';
import { injectCalendar } from './brn-calendar.token';

@Directive({
	selector: '[brnCalendarGrid]',
	standalone: true,
	host: {
		role: 'grid',
		'[attr.aria-labelledby]': 'calendar.header()?.id',
	},
})
export class BrnCalendarGridDirective<T> {
	/** Access the calendar component */
	protected readonly calendar = injectCalendar<T>();
}
