import { Component } from '@angular/core';
import { HlmDatePickerMultiComponent } from '@spartan-ng/helm/date-picker';

@Component({
	selector: 'spartan-date-picker-multiple',
	imports: [HlmDatePickerMultiComponent],
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
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerMultipleExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
