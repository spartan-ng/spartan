import { Component } from '@angular/core';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';

@Component({
	selector: 'spartan-calendar-multiple',
	imports: [HlmCalendarComponent],
	template: `
		<hlm-calendar mode="multiple" [(date)]="selectedDate" [min]="minDate" [max]="maxDate" />
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class CalendarMultipleExampleComponent {
	/** The selected date */
	public selectedDate = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const calendarMultipleCode = `
import { Component } from '@angular/core';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';

@Component({
	selector: 'spartan-calendar-multiple',
	imports: [HlmCalendarComponent],
	template: \`
		<hlm-calendar mode="multiple" [(date)]="selectedDate" [min]="minDate" [max]="maxDate" />
	\`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class CalendarMultipleExampleComponent {
	/** The selected date */
	public selectedDate = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
`;
