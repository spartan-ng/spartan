import { computed, Directive } from '@angular/core';
import { injectBrnYearMonthCalendar } from './brn-year-month-calendar.token';

@Directive({
	selector: 'button[brnYearMonthCalendarNextButton]',
	host: {
		type: 'button',
		'data-slot': 'year-month-next-button',
		'[attr.aria-label]': '_label()',
		'[attr.aria-disabled]': '_disabled() ? true : null',
		'[disabled]': '_disabled()',
		'(click)': '_yearMonth.goToNext()',
	},
})
export class BrnYearMonthCalendarNextButton {
	/** Access the month/year selector */
	protected readonly _yearMonth = injectBrnYearMonthCalendar();

	protected readonly _disabled = computed(() => this._yearMonth.isNextDisabled());

	protected readonly _label = computed(() =>
		this._yearMonth.view() === 'month' ? 'Go to the next year' : 'Go to the next years',
	);
}
