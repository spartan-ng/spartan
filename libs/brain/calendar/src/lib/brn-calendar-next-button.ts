import { Directive } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: '[brnCalendarNextButton]',
	host: {
		type: 'button',
		'[attr.aria-label]': '_i18n.config().labelNext()',
		'(click)': 'focusNextMonth()',
	},
})
export class BrnCalendarNextButton {
	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar();

	/** Access the date adapter */
	private readonly _dateAdapter = injectDateAdapter();

	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	/** Focus the next month */
	protected focusNextMonth(): void {
		const focusedDate = this._calendar.focusedDate();
		const date = this._dateAdapter.getDate(focusedDate);

		// go to start of month first, then add 1 month to avoid day overflow
		let nextMonthTarget = this._dateAdapter.startOfMonth(focusedDate);
		nextMonthTarget = this._dateAdapter.add(nextMonthTarget, { months: 1 });

		const lastDay = this._dateAdapter.endOfMonth(nextMonthTarget);

		// if we are on a date that does not exist in the next month, clamp to the last day of the month.
		let targetDate: typeof focusedDate;
		if (date > this._dateAdapter.getDate(lastDay)) {
			targetDate = lastDay;
		} else {
			targetDate = this._dateAdapter.set(nextMonthTarget, { day: date });
		}

		// if the date is disabled, but there are available dates in the month, focus the constrained date.
		const possibleDate = this._calendar.constrainDate(targetDate);

		if (this._dateAdapter.isSameMonth(possibleDate, targetDate)) {
			// if this date is within the same month, then focus it
			this._calendar.focusedDate.set(possibleDate);
			return;
		}

		this._calendar.focusedDate.set(targetDate);
	}
}
