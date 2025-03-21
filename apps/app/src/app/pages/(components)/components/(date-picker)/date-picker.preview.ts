import { Component } from '@angular/core';
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';

@Component({
	selector: 'spartan-date-picker-preview',
	imports: [HlmDatePickerComponent],
	template: `
		<hlm-date-picker [min]="minDate" [max]="maxDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerPreviewComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';

@Component({
	selector: 'spartan-date-picker-preview',
	standalone: true,
	imports: [HlmDatePickerComponent],
	template: \`
		<hlm-date-picker [min]="minDate" [max]="maxDate">
			<span>Pick a date</span>
		</hlm-date-picker>
	\`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerPreviewComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
`;

export const defaultImports = `
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';
`;

export const codeSkeleton = `
<hlm-date-picker [min]="minDate" [max]="maxDate" [autoCloseOnSelect]="true">
	<span>Pick a date</span>
</hlm-date-picker>
`;
