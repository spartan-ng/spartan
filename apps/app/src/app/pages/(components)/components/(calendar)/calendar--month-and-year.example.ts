import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCalendarImports } from '@spartan-ng/helm/calendar';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-month-year-example',
	imports: [HlmCardImports, HlmCalendarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [HlmCard],
	host: {
		class: 'p-0 w-fit mx-auto',
	},
	template: `
		<div hlmCardContent class="p-0">
			<hlm-month-year-calendar [(date)]="selectedDate" />
		</div>
	`,
})
export class CalendarMonthAndYearExample {
	/** The selected date */
	public selectedDate = new Date();
}
