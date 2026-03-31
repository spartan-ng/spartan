import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-multiple',
	imports: [HlmDatePickerImports, HlmFieldImports],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="datePickerMulti">Date Picker Multiple</label>
			<hlm-date-picker-multi
				buttonId="datePickerMulti"
				[min]="minDate"
				[max]="maxDate"
				[autoCloseOnMaxSelection]="true"
				[minSelection]="2"
				[maxSelection]="6"
			>
				<span>Pick dates</span>
			</hlm-date-picker-multi>
		</hlm-field>
	`,
})
export class DatePickerMultipleExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
