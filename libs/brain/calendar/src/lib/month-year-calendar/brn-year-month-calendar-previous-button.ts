import { computed, Directive } from '@angular/core';
import { injectBrnYearMonthCalendar } from './brn-year-month-calendar.token';

@Directive({
	selector: 'button[brnYearMonthCalendarPreviousButton]',
	host: {
		type: 'button',
		'data-slot': 'year-month-previous-button',
		'[attr.aria-label]': '_label()',
		'[attr.aria-disabled]': '_disabled() ? true : null',
		'[disabled]': '_disabled()',
		'(click)': '_yearMonth.goToPrevious()',
	},
})
export class BrnYearMonthCalendarPreviousButton {
	/** Access the month/year selector */
	protected readonly _yearMonth = injectBrnYearMonthCalendar();

	protected readonly _disabled = computed(() => this._yearMonth.isPreviousDisabled());

	protected readonly _label = computed(() =>
		this._yearMonth.view() === 'month' ? 'Go to the previous year' : 'Go to the previous years',
	);
}
