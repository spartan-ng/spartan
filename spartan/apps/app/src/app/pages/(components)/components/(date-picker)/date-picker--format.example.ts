import { Component } from '@angular/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	imports: [HlmDatePickerImports, HlmLabelImports],
	providers: [
		// Global formatDate config
		provideHlmDatePickerConfig({ formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy') }),
	],
	template: `
		<div class="flex flex-col gap-3">
			<label for="datePickerFormat" hlmLabel class="px-1">Date Picker with Custom Format</label>
			<hlm-date-picker buttonId="datePickerFormat" [min]="minDate" [max]="maxDate" [formatDate]="formatDate">
				<span>Pick a date</span>
			</hlm-date-picker>
		</div>
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
