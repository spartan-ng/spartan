import { Component } from '@angular/core';
import { HlmDatePickerMulti } from '@spartan-ng/helm/date-picker';

@Component({
	selector: 'spartan-date-picker-multiple',
	imports: [HlmDatePickerMulti],
	template: `
		<hlm-date-picker-multi
			[min]="minDate"
			[max]="maxDate"
			[autoCloseOnMaxSelection]="true"
			[minSelection]="2"
			[maxSelection]="6"
		>
			<span>Pick dates</span>
		</hlm-date-picker-multi>
	`,
})
export class DatePickerMultipleExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
