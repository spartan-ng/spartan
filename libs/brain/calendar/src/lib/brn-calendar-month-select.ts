import { computed, Directive, effect, inject } from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnSelect } from '@spartan-ng/brain/select';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: 'brnSelect[brnCalendarMonthSelect],hlm-select[brnCalendarMonthSelect]',
})
export class BrnCalendarMonthSelect {
	/** Access the select */
	private readonly _select = inject(BrnSelect);

	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar();

	/** Access the date adapter */
	private readonly _dateAdapter = injectDateAdapter();

	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	protected readonly _selectedMonth = computed(() => {
		return this._i18n.config().months()[this._dateAdapter.getMonth(this._calendar.focusedDate())];
	});

	constructor() {
		// React to user selection through the injected select's typed `value` output rather than a
		// host-listener `$event` (which Angular types as `Event`). The month select's values are the
		// month strings, so narrow to `string` before handling.
		outputToObservable(this._select.value)
			.pipe(takeUntilDestroyed())
			.subscribe((value) => {
				if (typeof value === 'string') {
					this.monthSelected(value);
				}
			});

		effect(() => {
			this._select.writeValue(this._selectedMonth());
		});
	}

	/** Focus selected month */
	private monthSelected(selectedMonth: string): void {
		const month = this._i18n
			.config()
			.months()
			.findIndex((month) => month === selectedMonth);
		const targetDate = this._dateAdapter.set(this._calendar.focusedDate(), { month });
		this._calendar.focusedDate.set(targetDate);
	}
}
