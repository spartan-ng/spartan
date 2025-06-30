import { Component } from '@angular/core';
import { HlmCalendarComponent } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-preview',
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
	public selectedDate = new Date();

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const defaultImports = `
import {
  HlmCalendarComponent,
} from '@spartan-ng/helm/calendar';
`;

export const defaultSkeleton = `
<hlm-calendar
	[(date)]="selectedDate"
	[min]="minDate"
	[max]="maxDate"
	[disabled]="false"
	[dateDisabled]="(date) => false"
	[weekStartsOn]="0"
/>
`;
