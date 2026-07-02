import { Directive, input } from '@angular/core';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

let uniqueId = 0;

@Directive({
	selector: 'button[brnMonthYearCalendarHeader]',
	host: {
		'[id]': 'id()',
		'[style.pointer-events]': '_monthYear.disabled() || _monthYear.view() === "year" ? "none" : null',
		'(click)': '_monthYear.view.set("year")',
	},
})
export class BrnMonthYearCalendarHeader {
	/** The unique id for the header */
	public readonly id = input<string>(`brn-month-year-header-${++uniqueId}`);

	protected readonly _monthYear = injectBrnMonthYearCalendar();
}
