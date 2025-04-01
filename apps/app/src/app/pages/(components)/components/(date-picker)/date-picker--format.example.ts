import { Component } from '@angular/core';
import { DateValue } from '@spartan-ng/brain/calendar';
import { HlmDatePickerComponent, provideHlmDatePickerConfig } from '@spartan-ng/ui-date-picker-helm';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	imports: [HlmDatePickerComponent],
	template: `
		<hlm-date-picker [min]="minDate" [max]="maxDate" [formatDate]="formatDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	`,
	providers: [
		// Global formatDate config
		provideHlmDatePickerConfig({ formatDate: (date) => DateTime.fromJSDate(date as Date).toFormat('dd.MM.yyyy') }),
	],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormatExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	/** Overrides global formatDate  */
	public formatDate = (date: DateValue<Date>) => DateTime.fromJSDate(date as Date).toFormat('MMMM dd, yyyy');
}

export const datePickerFormatCode = `
import { Component } from '@angular/core';
import { DateValue } from '@spartan-ng/brain/calendar';
import { HlmDatePickerComponent, provideHlmDatePickerConfig } from '@spartan-ng/ui-date-picker-helm';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	imports: [HlmDatePickerComponent],
	template: \`
		<hlm-date-picker [min]="minDate" [max]="maxDate" [formatDate]="formatDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	\`,
	providers: [
		// Global formatDate config
		provideHlmDatePickerConfig({ formatDate: (date) => DateTime.fromJSDate(date as Date).toFormat('dd.MM.yyyy') }),
	],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormatExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	/** Overrides global formatDate  */
	public formatDate = (date: DateValue<Date>) => DateTime.fromJSDate(date as Date).toFormat('MMMM dd, yyyy');
}
`;
