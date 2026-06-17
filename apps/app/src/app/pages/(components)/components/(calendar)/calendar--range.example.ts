import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-calendar-range',
	imports: [HlmCalendarImports, HlmCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmCard],
	host: {
		class: 'p-0 w-fit mx-auto',
	},
	template: `
		<div hlmCardContent class="p-0">
			<hlm-calendar-range [(startDate)]="start" [(endDate)]="end" [min]="minDate" [max]="maxDate" />
		</div>
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
