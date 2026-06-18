import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-calendar-multiple',
	imports: [HlmCalendarImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmCard],
	host: {
		class: 'p-0 w-fit mx-auto',
	},
	template: `
		<div hlmCardContent class="p-0">
			<hlm-calendar-multi
				[(date)]="selectedDates"
				[min]="minDate"
				[max]="maxDate"
				[minSelection]="2"
				[maxSelection]="6"
			/>
		</div>
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
