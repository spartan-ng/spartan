import { computed, Directive } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';
import { nearestEnabledDateInMonth } from './utils/nearest-enabled-date-in-month';

@Directive({
	selector: 'button[brnCalendarPreviousButton]',
	exportAs: 'brnCalendarPreviousButton',
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

	/**
	 * An enabled day in the previous month, closest to the focused day number.
	 * Undefined when the whole month is outside min/max or rejected by `dateDisabled`.
	 */
	private readonly _enabledTarget = computed(() => {
		const targetDate = this.previousMonthDate();
		return nearestEnabledDateInMonth(targetDate, targetDate, this._dateAdapter, (date) =>
			this._calendar.isDateDisabled(date),
		);
	});

	/** Whether navigating to the previous month is disabled. */
	protected readonly _disabled = computed(() => this._enabledTarget() === undefined);

	/** Focus the previous month */
	protected focusPreviousMonth(): void {
		const date = this._enabledTarget();
		if (date === undefined) {
			return;
		}

		this._calendar.setFocusedDate(date);
	}

	/** The same day number in the previous month, clamped to that month's length. */
	private previousMonthDate() {
		const focusedDate = this._calendar.focusedDate();
		const date = this._dateAdapter.getDate(focusedDate);

		// go to start of month first, then subtract 1 month to avoid day overflow
		let previousMonthTarget = this._dateAdapter.startOfMonth(focusedDate);
		previousMonthTarget = this._dateAdapter.subtract(previousMonthTarget, { months: 1 });

		const lastDay = this._dateAdapter.endOfMonth(previousMonthTarget);

		// if we are on a date that does not exist in the previous month, clamp to the last day of the month.
		if (date > this._dateAdapter.getDate(lastDay)) {
			return lastDay;
		}

		return this._dateAdapter.set(previousMonthTarget, { day: date });
	}
}
