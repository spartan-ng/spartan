import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-preview',
	imports: [HlmDatePickerImports, HlmFieldImports],
	template: `
		<hlm-field>
			<label hlmFieldLabel>Date of birth</label>
			<hlm-date-picker [minDate]="minDate" [maxDate]="maxDate">
				<hlm-date-picker-trigger buttonId="date">Pick a date</hlm-date-picker-trigger>
			</hlm-date-picker>
		</hlm-field>
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
<hlm-date-picker [minDate]="minDate" [maxDate]="maxDate">
  <hlm-date-picker-trigger buttonId="date">Pick a date</hlm-date-picker-trigger>
</hlm-date-picker>

`;
