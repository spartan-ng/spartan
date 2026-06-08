import { Directive, effect, inject } from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnSelect } from '@spartan-ng/brain/select';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: 'brnSelect[brnCalendarYearSelect],hlm-select[brnCalendarYearSelect]',
})
export class BrnCalendarYearSelect {
	/** Access the select */
	private readonly _select = inject(BrnSelect);

	/** Access the calendar */
	private readonly _calendar = injectBrnCalendar();

	/** Access the date adapter */
	private readonly _dateAdapter = injectDateAdapter();

	/** Access the calendar i18n */
	protected readonly _i18n = injectBrnCalendarI18n();

	constructor() {
		// React to user selection through the injected select's typed `value` output rather than a
		// host-listener `$event` (which Angular types as `Event`). The year select's values are
		// numbers, so narrow to `number` before handling.
		outputToObservable(this._select.value)
			.pipe(takeUntilDestroyed())
			.subscribe((value) => {
				if (typeof value === 'number') {
					this.yearSelected(value);
				}
			});

		effect(() => {
			this._select.writeValue(this._dateAdapter.getYear(this._calendar.focusedDate()));
		});
	}

	/** Focus selected year */
	private yearSelected(year: number): void {
		const targetDate = this._dateAdapter.set(this._calendar.focusedDate(), { year });
		this._calendar.focusedDate.set(targetDate);
	}
}
