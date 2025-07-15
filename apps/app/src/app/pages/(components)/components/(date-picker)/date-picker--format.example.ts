import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmDatePicker, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	imports: [HlmDatePicker, FormsModule],
	template: `
		<hlm-date-picker [min]="minDate" [max]="maxDate" [formatDate]="formatDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	`,
	providers: [
		// Global formatDate config
		provideHlmDatePickerConfig({ formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy') }),
	],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormatExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	/** Overrides global formatDate  */
	public formatDate = (date: Date) => DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
}
