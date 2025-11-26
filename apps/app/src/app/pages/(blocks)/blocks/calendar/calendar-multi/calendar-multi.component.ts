import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCalendarMulti } from '@spartan-ng/helm/calendar';

@Component({
	selector: 'spartan-calendar-multi',
	imports: [HlmCalendarMulti],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center items-start p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<hlm-calendar-multi
			[(date)]="selectedDates"
			[min]="minDate"
			[max]="maxDate"
			[minSelection]="2"
			[maxSelection]="6"
			class="bg-background"
		/>
	`,
})
export class CalendarMultiComponent {
	/** The selected date */
	public selectedDates = [new Date()];

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
