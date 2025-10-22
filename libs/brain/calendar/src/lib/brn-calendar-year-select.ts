import { Directive, effect, inject } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnSelect } from '@spartan-ng/brain/select';
import { injectBrnCalendar } from './brn-calendar.token';
import { injectBrnCalendarI18n } from './i18n/calendar-i18n';

@Directive({
	selector: 'brn-select[brnCalendarYearSelect]',
	host: {
		'(valueChange)': 'yearSelected($event)',
	},
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
		effect(() => {
			this._select.writeValue(this._dateAdapter.getYear(this._calendar.focusedDate()));
		});
	}

	/** Focus selected year */
	protected yearSelected(year: number): void {
		const targetDate = this._dateAdapter.set(this._calendar.focusedDate(), { year });
		this._calendar.focusedDate.set(targetDate);
	}
}
