import { Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-multiple',
	imports: [HlmCalendarImports],
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
export class CalendarMultipleExample {
	/** The selected date */
	public selectedDates = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
