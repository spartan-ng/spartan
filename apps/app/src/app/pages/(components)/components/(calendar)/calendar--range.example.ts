import { Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-range',
	imports: [HlmCalendarImports],
	template: `
		<hlm-calendar-range [(startDate)]="start" [(endDate)]="end" [min]="minDate" [max]="maxDate" />
	`,
})
export class CalendarRangeExample {
	/** The selected date */
	public start = new Date();
	public end = new Date(this.start.getTime() + 5 * 24 * 60 * 60 * 1000);

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
