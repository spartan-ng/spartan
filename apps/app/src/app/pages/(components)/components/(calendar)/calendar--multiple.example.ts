import { Component } from '@angular/core';
import { HlmCalendarMultiComponent } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-multiple',
	imports: [HlmCalendarMultiComponent],
	template: `
		<hlm-calendar-multi
			[(date)]="selectedDates"
			[min]="minDate"
			[max]="maxDate"
			[minSelection]="2"
			[maxSelection]="6"
		/>
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class CalendarMultipleExampleComponent {
	/** The selected date */
	public selectedDates = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const calendarMultipleCode = `
import { Component } from '@angular/core';
import { HlmCalendarMultiComponent } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-multiple',
	imports: [HlmCalendarMultiComponent],
	template: \`
		<hlm-calendar-multi
			[(date)]="selectedDates"
			[min]="minDate"
			[max]="maxDate"
			[minSelection]="2"
			[maxSelection]="6"
		/>
	\`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class CalendarMultipleExampleComponent {
	/** The selected date */
	public selectedDates = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
`;
