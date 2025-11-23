import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-disabled-days',
	imports: [HlmCalendar],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex pt-20 justify-center',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-calendar [min]="minDate" [max]="maxDate" [dateDisabled]="_dateDisabled" />
	`,
})
export default class CalendarDisabledDaysPage {
	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter();

	/** The minimum date */
	public minDate = new Date(2003, 1, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	protected readonly _dateDisabled = (date: Date): boolean => {
		return this._dateAdapter.isBefore(date, this._dateAdapter.startOfDay(this._dateAdapter.now()));
	};
}
