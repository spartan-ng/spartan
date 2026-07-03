import { computed, Directive } from '@angular/core';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: 'button[brnMonthYearCalendarPreviousButton]',
	host: {
		type: 'button',
		'data-slot': 'month-year-previous-button',
		'[attr.aria-label]': '_label()',
		'[attr.aria-disabled]': '_disabled() ? true : null',
		'[disabled]': '_disabled()',
		'(click)': '_monthYear.goToPrevious()',
	},
})
export class BrnMonthYearCalendarPreviousButton {
	/** Access the month/year selector */
	protected readonly _monthYear = injectBrnMonthYearCalendar();

	protected readonly _disabled = computed(() => this._monthYear.isPreviousDisabled());

	protected readonly _label = computed(() =>
		this._monthYear.view() === 'month' ? 'Go to the previous year' : 'Go to the previous years',
	);
}
