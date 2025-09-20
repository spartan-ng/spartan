import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';

@Component({
	selector: 'spartan-date-picker-range',
	imports: [HlmDatePickerImports, FormsModule],
	template: `
		<hlm-date-range-picker [min]="minDate" [max]="maxDate" [autoCloseOnEndSelection]="true">
			<span>Enter a date range</span>
		</hlm-date-range-picker>
	`,
})
export class DatePickerRangeExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
