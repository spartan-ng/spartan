import { computed, Directive } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: 'button[brnCalendarPreviousButton]',
	host: {
		type: 'button',
		'data-slot': 'calendar-previous-button',
		'[attr.aria-label]': '_i18n.config().labelPrevious()',
		'[attr.aria-disabled]': '_disabled() ? true : null',
		'[disabled]': '_disabled()',
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

	/** Whether navigating to the previous month is disabled. */
	protected readonly _disabled = computed(() => {
		const { targetDate, possibleDate } = this.previousMonthTarget();
		const effective = this._dateAdapter.isSameMonth(possibleDate, targetDate) ? possibleDate : targetDate;
		return this._calendar.isDateDisabled(effective);
	});

	/** Focus the previous month */
	protected focusPreviousMonth(): void {
		if (this._disabled()) {
			return;
		}

		const { targetDate, possibleDate } = this.previousMonthTarget();

		if (this._dateAdapter.isSameMonth(possibleDate, targetDate)) {
			// if this date is within the same month, then focus it
			this._calendar.setFocusedDate(possibleDate);
			return;
		}

		this._calendar.setFocusedDate(targetDate);
	}

	/** @internal The target date in the previous month and its constrained counterpart. */
	private previousMonthTarget(): { targetDate: unknown; possibleDate: unknown } {
		const focusedDate = this._calendar.focusedDate();
		const date = this._dateAdapter.getDate(focusedDate);

		// go to start of month first, then subtract 1 month to avoid day overflow
		let previousMonthTarget = this._dateAdapter.startOfMonth(focusedDate);
		previousMonthTarget = this._dateAdapter.subtract(previousMonthTarget, { months: 1 });

		const lastDay = this._dateAdapter.endOfMonth(previousMonthTarget);

		// if we are on a date that does not exist in the previous month, clamp to the last day of the month.
		let targetDate: typeof focusedDate;
		if (date > this._dateAdapter.getDate(lastDay)) {
			targetDate = lastDay;
		} else {
			targetDate = this._dateAdapter.set(previousMonthTarget, { day: date });
		}

		// if the date is disabled, but there are available dates in the month, focus the constrained date.
		return { targetDate, possibleDate: this._calendar.constrainDate(targetDate) };
	}
}
