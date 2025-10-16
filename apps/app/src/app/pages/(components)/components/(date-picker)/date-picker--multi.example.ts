import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-multiple',
	imports: [HlmDatePickerImports, HlmLabelImports],
	template: `
		<div class="flex flex-col gap-3">
			<label for="datePickerMulti" hlmLabel class="px-1">Date Picker Multiple</label>
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
		</div>
	`,
})
export class DatePickerMultipleExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
