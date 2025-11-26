import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { HlmCalendar } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-disabled-weekends',
	imports: [HlmCalendar],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center items-start p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<hlm-calendar
			class="bg-background"
			[min]="minDate"
			[max]="maxDate"
			[dateDisabled]="_dateDisabled"
			[calendarClass]="calendarClass"
		/>
	`,
})
export class CalendarDisabledWeekendsComponent {
	public readonly calendarClass = `
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
