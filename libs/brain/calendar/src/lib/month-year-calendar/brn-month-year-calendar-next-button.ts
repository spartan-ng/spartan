import { computed, Directive } from '@angular/core';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: 'button[brnMonthYearCalendarNextButton]',
	host: {
		type: 'button',
		'data-slot': 'month-year-next-button',
		'[attr.aria-label]': '_label()',
		'[attr.aria-disabled]': '_disabled() ? true : null',
		'[disabled]': '_disabled()',
		'(click)': '_monthYear.goToNext()',
	},
})
export class BrnMonthYearCalendarNextButton {
	/** Access the month/year selector */
	protected readonly _monthYear = injectBrnMonthYearCalendar();

	protected readonly _disabled = computed(() => this._monthYear.isNextDisabled());

	protected readonly _label = computed(() =>
		this._monthYear.view() === 'month' ? 'Go to the next year' : 'Go to the next years',
	);
}
