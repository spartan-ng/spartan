import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-preview',
	imports: [HlmDatePickerImports, HlmLabelImports],
	template: `
		<div class="flex flex-col gap-3">
			<label for="date" hlmLabel class="px-1">Date of birth</label>
			<hlm-date-picker buttonId="date" [min]="minDate" [max]="maxDate">
				<span>Select date</span>
			</hlm-date-picker>
		</div>
	`,
})
export class DatePickerPreview {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const defaultImports = `
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
`;

export const defaultSkeleton = `
<hlm-date-picker [min]="minDate" [max]="maxDate">
	<span>Pick a date</span>
</hlm-date-picker>
`;
