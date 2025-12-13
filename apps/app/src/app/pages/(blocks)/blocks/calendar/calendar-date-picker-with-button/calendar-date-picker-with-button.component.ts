import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { DateTime } from 'luxon';
import { DatePickerWithButton } from './calendar-date-picker-with-button/date-picker-with-button';
import { provideDatePickerWithButtonConfig } from './calendar-date-picker-with-button/date-picker-with-button.token';

@Component({
	selector: 'spartan-calendar-date-picker-with-button',
	imports: [HlmLabel, DatePickerWithButton],
	providers: [
		provideDatePickerWithButtonConfig({ formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy') }),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<div class="flex flex-col gap-3">
			<label for="datePickerWithButton" hlmLabel class="px-1">Date Picker with Button</label>
			<spartan-date-picker-with-button
				buttonId="datePickerWithButton"
				[min]="minDate"
				[max]="maxDate"
				[formatDate]="formatDate"
			>
				<span>Pick a date</span>
			</spartan-date-picker-with-button>
		</div>
	`,
})
export class CalendarDatePickerWithButtonComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	/** Overrides global formatDate  */
	public formatDate = (date: Date) => DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
}
