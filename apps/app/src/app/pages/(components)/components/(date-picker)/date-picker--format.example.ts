import { Component } from '@angular/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	imports: [HlmDatePickerImports, HlmFieldImports],
	providers: [
		// Global formatDate config
		provideHlmDatePickerConfig({ formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy') }),
	],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="datePickerFormat">Date Picker with Custom Format</label>
			<hlm-date-picker buttonId="datePickerFormat" [min]="minDate" [max]="maxDate" [formatDate]="formatDate">
				<span>Pick a date</span>
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class DatePickerFormatExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	/** Overrides global formatDate  */
	public formatDate = (date: Date) => DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
}
