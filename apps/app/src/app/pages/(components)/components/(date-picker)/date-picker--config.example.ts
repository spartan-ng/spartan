import { Component } from '@angular/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-config',
	imports: [HlmDatePickerImports, HlmFieldImports],
	providers: [
		provideHlmDatePickerConfig({
			formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy'),
			transformDate: (date: Date) => DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate(),
		}),
	],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="customConfig">Date Picker with Config</label>
			<hlm-date-picker [min]="minDate" [max]="maxDate">
				<hlm-date-picker-trigger buttonId="customConfig">Pick a date</hlm-date-picker-trigger>
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class DatePickerConfigExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
