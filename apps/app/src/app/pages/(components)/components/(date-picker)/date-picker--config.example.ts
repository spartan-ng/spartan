import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmDatePickerComponent, provideHlmDatePickerConfig } from '@spartan-ng/ui-date-picker-helm';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-config',
	standalone: true,
	imports: [HlmDatePickerComponent, FormsModule],
	template: `
		<hlm-date-picker [min]="minDate" [max]="maxDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	`,
	providers: [
		provideHlmDatePickerConfig({
			formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy'),
			transformDate: (date: Date) => DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate(),
		}),
	],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerConfigExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const datePickerConfigCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmDatePickerComponent, provideHlmDatePickerConfig } from '@spartan-ng/ui-date-picker-helm';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-config',
	standalone: true,
	imports: [HlmDatePickerComponent, FormsModule],
	template: \`
		<hlm-date-picker [min]="minDate" [max]="maxDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	\`,
	providers: [
		provideHlmDatePickerConfig({
			formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy'),
			transformDate: (date: Date) => DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate(),
		}),
	],
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerConfigExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
`;
