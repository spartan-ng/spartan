import { computed, Directive } from '@angular/core';
import { injectBrnCalendarI18n } from '../i18n/calendar-i18n';
import { injectBrnMonthYearCalendar } from './brn-month-year-calendar.token';

@Directive({
	selector: 'button[brnMonthYearCalendarNextButton]',
	exportAs: 'brnMonthYearCalendarNextButton',
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

	/** Access the calendar i18n */
	private readonly _i18n = injectBrnCalendarI18n();

	protected readonly _disabled = computed(() => this._monthYear.isNextDisabled());

	protected readonly _label = computed(() => {
		const config = this._i18n.config();
		return this._monthYear.view() === 'month'
			? (config.labelNextYear?.() ?? 'Go to the next year')
			: (config.labelNextYears?.() ?? 'Go to the next years');
	});
}
