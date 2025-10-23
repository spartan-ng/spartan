import { Directive } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: '[brnCalendarPreviousButton]',
	host: {
		type: 'button',
		'[attr.aria-label]': '_i18n.config().labelPrevious()',
		'(click)': 'focusPreviousMonth()',
	},
})
export class BrnCalendarPreviousButton {
	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar();

	/** Access the date adapter */
	private readonly _dateAdapter = injectDateAdapter();

	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	/** Focus the previous month */
	protected focusPreviousMonth(): void {
		const targetDate = this._dateAdapter.subtract(this._calendar.focusedDate(), { months: 1 });

		// if the date is disabled, but there are available dates in the month, focus the last day of the month.
		const possibleDate = this._calendar.constrainDate(targetDate);

		if (this._dateAdapter.isSameMonth(possibleDate, targetDate)) {
			// if this date is within the same month, then focus it
			this._calendar.focusedDate.set(possibleDate);
			return;
		}

		this._calendar.focusedDate.set(targetDate);
	}
}
