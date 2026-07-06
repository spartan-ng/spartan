import { Directive, input } from '@angular/core';
import { injectBrnYearMonthCalendar } from './brn-year-month-calendar.token';

let uniqueId = 0;

@Directive({
	selector: 'button[brnYearMonthCalendarHeader]',
	host: {
		'[id]': 'id()',
		'[style.pointer-events]': '_yearMonth.disabled() || _yearMonth.view() === "year" ? "none" : null',
		'(click)': '_yearMonth.view.set("year")',
	},
})
export class BrnYearMonthCalendarHeader {
	/** The unique id for the header */
	public readonly id = input<string>(`brn-year-month-header-${++uniqueId}`);

	protected readonly _yearMonth = injectBrnYearMonthCalendar();
}
