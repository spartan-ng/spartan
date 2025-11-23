import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-disabled-weekends',
	imports: [HlmCalendar],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex pt-20 justify-center',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-calendar [min]="minDate" [max]="maxDate" [dateDisabled]="_dateDisabled" [calendarClass]="_calendarClass" />
	`,
})
export default class CalendarDisabledWeekendsPage {
	public readonly _calendarClass = `
        [&_[data-outside]]:opacity-80 
        [&_[data-outside]:hover]:opacity-100
        [&_[data-outside]:hover]:text-neutral-900
        [&_[data-disabled][data-outside]]:opacity-50
    `;
	/** Access the date adapter */
	protected readonly _dateAdapter = injectDateAdapter();

	/** The minimum date */
	public minDate = new Date(2003, 1, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	protected readonly _dateDisabled = (date: Date): boolean => {
		const day = this._dateAdapter.getDay(date);
		return day === 0 || day === 6;
	};
}
