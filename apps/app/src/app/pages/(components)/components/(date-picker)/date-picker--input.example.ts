import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-input',
	imports: [HlmDatePickerImports, HlmFieldImports],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="subscription-date">Subscription Date</label>
			<hlm-date-picker [min]="minDate" [max]="maxDate">
				<hlm-date-picker-input inputId="date-input" placeholder="Pick a date" />
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class DatePickerInputExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
