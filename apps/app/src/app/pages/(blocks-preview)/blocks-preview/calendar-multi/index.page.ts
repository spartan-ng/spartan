import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmCalendarMulti } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-multi',
	imports: [HlmCalendarMulti],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex pt-20 justify-center',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-calendar-multi
			[(date)]="selectedDates"
			[min]="minDate"
			[max]="maxDate"
			[minSelection]="2"
			[maxSelection]="6"
		/>
	`,
})
export default class CalendarMultiPage {
	/** The selected date */
	public selectedDates = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
