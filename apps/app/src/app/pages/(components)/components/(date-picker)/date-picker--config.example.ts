import { Component } from '@angular/core';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-config',
	imports: [HlmDatePickerImports, HlmLabelImports],
	providers: [
		provideHlmDatePickerConfig({
			formatDate: (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy'),
			transformDate: (date: Date) => DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate(),
		}),
	],
	template: `
		<div class="flex flex-col gap-3">
			<label for="customConfig" hlmLabel class="px-1">Date Picker with Config</label>
			<hlm-date-picker buttonId="customConfig" [min]="minDate" [max]="maxDate">
				<span>Pick a date</span>
			</hlm-date-picker>
		</div>
	`,
})
export class DatePickerConfigExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
