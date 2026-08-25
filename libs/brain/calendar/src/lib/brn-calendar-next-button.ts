import { computed, Directive } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: 'button[brnCalendarNextButton]',
	host: {
		type: 'button',
		'data-slot': 'calendar-next-button',
		'[attr.aria-label]': '_i18n.config().labelNext()',
		'[attr.aria-disabled]': '_disabled() ? true : null',
		'[disabled]': '_disabled()',
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

	/** Whether navigating to the next month is disabled. */
	protected readonly _disabled = computed(() => {
		const { targetDate, possibleDate } = this.nextMonthTarget();
		const effective = this._dateAdapter.isSameMonth(possibleDate, targetDate) ? possibleDate : targetDate;
		return this._calendar.isDateDisabled(effective);
	});

	/** Focus the next month */
	protected focusNextMonth(): void {
		if (this._disabled()) {
			return;
		}

		const { targetDate, possibleDate } = this.nextMonthTarget();

		if (this._dateAdapter.isSameMonth(possibleDate, targetDate)) {
			// if this date is within the same month, then focus it
			this._calendar.setFocusedDate(possibleDate);
			return;
		}

		this._calendar.setFocusedDate(targetDate);
	}

	/** @internal The target date in the next month and its constrained counterpart. */
	private nextMonthTarget(): { targetDate: unknown; possibleDate: unknown } {
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
		return { targetDate, possibleDate: this._calendar.constrainDate(targetDate) };
	}
}
