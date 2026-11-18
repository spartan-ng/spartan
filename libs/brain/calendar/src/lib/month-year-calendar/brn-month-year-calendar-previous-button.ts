import { computed, Directive } from '@angular/core';
import { injectBrnCalendarI18n } from '../i18n/calendar-i18n';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: 'button[brnMonthYearCalendarPreviousButton]',
	exportAs: 'brnMonthYearCalendarPreviousButton',
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

	/** Access the calendar i18n */
	private readonly _i18n = injectBrnCalendarI18n();

	protected readonly _disabled = computed(() => this._monthYear.isPreviousDisabled());

	protected readonly _label = computed(() => {
		const config = this._i18n.config();
		return this._monthYear.view() === 'month'
			? (config.labelPreviousYear?.() ?? 'Go to the previous year')
			: (config.labelPreviousYears?.() ?? 'Go to the previous years');
	});
}
