import { computed, Directive, effect, inject } from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnSelect } from '@spartan-ng/brain/select';
import { injectBrnCalendarMonth } from './brn-calendar-month';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: 'brnSelect[brnCalendarMonthSelect],hlm-select[brnCalendarMonthSelect]',
	exportAs: 'brnCalendarMonthSelect',
})
export class BrnCalendarMonthSelect {
	/** Access the select */
	private readonly _select = inject(BrnSelect);

	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar();

	/** Access the month this select belongs to, if rendering multiple months */
	private readonly _month = injectBrnCalendarMonth();

	/** Access the date adapter */
	private readonly _dateAdapter = injectDateAdapter();

	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	/** The month displayed by this select */
	private readonly _displayedMonth = computed(() => this._month?.month() ?? this._calendar.focusedDate());

	/** Whether the select value is being synced from the calendar rather than picked by the user */
	private _syncing = false;

	protected readonly _selectedMonth = computed(() => {
		return this._i18n.config().months()[this._dateAdapter.getMonth(this._displayedMonth())];
	});

	constructor() {
		// React to user selection through the injected select's typed `value` output rather than a
		// host-listener `$event` (which Angular types as `Event`). The month select's values are the
		// month strings, so narrow to `string` before handling.
		outputToObservable(this._select.value)
			.pipe(takeUntilDestroyed())
			.subscribe((value) => {
				// writeValue emits on the same output; only a real user selection should move focus.
				if (!this._syncing && typeof value === 'string') {
					this.monthSelected(value);
				}
			});

		effect(() => {
			this._syncSelect(this._selectedMonth());
		});
	}

	/** Focus selected month */
	private monthSelected(selectedMonth: string): void {
		const month = this._i18n
			.config()
			.months()
			.findIndex((month) => month === selectedMonth);
		const focusedDate = this._calendar.focusedDate();
		// Start from the first of the month so a day that does not exist in the target month
		// (e.g. the 31st) cannot roll over into the following month - clamp it instead.
		const targetDate = this._dateAdapter.set(this._dateAdapter.startOfMonth(this._displayedMonth()), { month });
		const lastDay = this._dateAdapter.getDate(this._dateAdapter.endOfMonth(targetDate));
		const day = Math.min(this._dateAdapter.getDate(focusedDate), lastDay);
		// Like the previous/next buttons, constrain the target to min/max instead of letting
		// setFocusedDate reject it: otherwise the grid stays on the old month.
		const target = this._calendar.constrainDate(this._dateAdapter.set(targetDate, { day }));
		this._calendar.setFocusedDate(target);
		// Keep the selected month at the position of this select when rendering multiple months.
		// A rejected target leaves the focused date unchanged, so the displayed months must not move.
		if (this._dateAdapter.isSameDay(this._calendar.focusedDate(), target)) {
			this._calendar.showMonth?.(target, this._month?.offset() ?? 0);
		}
		// The select already shows the picked month. When the focused month did not change
		// (target rejected or constrained back into it), the effect does not run again.
		this._syncSelect(this._selectedMonth());
	}

	/** Write the calendar's value into the select without treating it as a user selection */
	private _syncSelect(value: string): void {
		this._syncing = true;
		try {
			this._select.writeValue(value);
		} finally {
			this._syncing = false;
		}
	}
}
