import { Component } from '@angular/core';
import { HlmCalendarComponent } from '@spartan-ng/ui-calendar-helm';

@Component({
	selector: 'spartan-calendar-preview',
	standalone: true,
	imports: [HlmCalendarComponent],
	template: `
		<hlm-calendar [(date)]="selectedDate" [min]="minDate" [max]="maxDate" />
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class CalendarPreviewComponent {
	/** The selected date */
	selectedDate = new Date();

	/** The minimum date */
	minDate = new Date(2023, 0, 1);

	/** The maximum date */
	maxDate = new Date(2030, 11, 31);
}

export const defaultCode = `
@Component({
	selector: 'spartan-calendar-preview',
	standalone: true,
	imports: [HlmCalendarComponent],
	template: '<hlm-calendar [(date)]="selectedDate" [min]="minDate" [max]="maxDate" />',
})
export class CalendarPreviewComponent {
	/** The selected date */
	selectedDate = new Date();

	/** The minimum date */
	minDate = new Date(2023, 0, 1);

	/** The maximum date */
	maxDate = new Date(2030, 11, 31);
}
`;

export const defaultImports = `
import {
  HlmCalendarComponent,
} from '@spartan-ng/ui-calendar-helm';
`;

export const codeSkeleton = `
<hlm-calendar
	[(date)]="selectedDate"
	[min]="minDate"
	[max]="maxDate"
	[disabled]="false"
	[dateDisabled]="(date) => false"
	[weekStartsOn]="0"
/>
`;
