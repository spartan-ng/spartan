import { Component } from '@angular/core';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';

@Component({
	selector: 'spartan-date-picker-preview',
	imports: [HlmDatePicker],
	template: `
		<hlm-date-picker [min]="minDate" [max]="maxDate">
			<span>Select date</span>
		</hlm-date-picker>
	`,
})
export class DatePickerPreview {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const defaultImports = `
import { HlmDatePickerComponent } from '@spartan-ng/helm/date-picker';
`;

export const defaultSkeleton = `
<hlm-date-picker [min]="minDate" [max]="maxDate">
	<span>Pick a date</span>
</hlm-date-picker>
`;
