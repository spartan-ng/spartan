import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-range',
	imports: [HlmDatePickerImports, HlmFieldImports],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="dateRange">Date Picker Range</label>
			<hlm-date-range-picker buttonId="dateRange" [min]="minDate" [max]="maxDate" [autoCloseOnEndSelection]="true">
				<span>Enter a date range</span>
			</hlm-date-range-picker>
		</hlm-field>
	`,
})
export class DatePickerRangeExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
