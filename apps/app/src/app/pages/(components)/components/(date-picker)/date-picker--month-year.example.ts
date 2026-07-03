import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-month-year-picker',
	imports: [HlmDatePickerImports, HlmFieldImports, FormsModule, ReactiveFormsModule],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="date-month-year">Month Year Picker</label>
			<hlm-month-year-picker [min]="minDate" [max]="maxDate" autoCloseOnSelect>
				<hlm-month-year-input inputId="date-month-year" placeholder="MM/YYYY" />
			</hlm-month-year-picker>
		</hlm-field>
	`,
})
export class DatePickerMonthYearExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
