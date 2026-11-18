import { computed, Directive } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';
import { nearestEnabledDateInMonth } from './utils/nearest-enabled-date-in-month';

@Directive({
	selector: 'button[brnCalendarNextButton]',
	exportAs: 'brnCalendarNextButton',
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

	/**
	 * An enabled day in the next month, closest to the focused day number.
	 * Undefined when the whole month is outside min/max or rejected by `dateDisabled`.
	 */
	private readonly _enabledTarget = computed(() => {
		const targetDate = this.nextMonthDate();
		return nearestEnabledDateInMonth(targetDate, targetDate, this._dateAdapter, (date) =>
			this._calendar.isDateDisabled(date),
		);
	});

	/** Whether navigating to the next month is disabled. */
	protected readonly _disabled = computed(() => this._enabledTarget() === undefined);

	/** Focus the next month */
	protected focusNextMonth(): void {
		const date = this._enabledTarget();
		if (date === undefined) {
			return;
		}

		this._calendar.setFocusedDate(date);
	}

	/** The same day number in the next month, clamped to that month's length. */
	private nextMonthDate() {
		const focusedDate = this._calendar.focusedDate();
		const date = this._dateAdapter.getDate(focusedDate);

		// go to start of month first, then add 1 month to avoid day overflow
		let nextMonthTarget = this._dateAdapter.startOfMonth(focusedDate);
		nextMonthTarget = this._dateAdapter.add(nextMonthTarget, { months: 1 });

		const lastDay = this._dateAdapter.endOfMonth(nextMonthTarget);

		// if we are on a date that does not exist in the next month, clamp to the last day of the month.
		if (date > this._dateAdapter.getDate(lastDay)) {
			return lastDay;
		}

		return this._dateAdapter.set(nextMonthTarget, { day: date });
	}
}
