import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	standalone: true,
	imports: [HlmDatePickerComponent, FormsModule],
	template: `
		<hlm-date-picker [min]="minDate" [max]="maxDate" [dateFormat]="dateFormat">
			<span>Pick a date</span>
		</hlm-date-picker>
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormatExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	public dateFormat = (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy');
}

export const datePickerFormatCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-format',
	standalone: true,
	imports: [HlmDatePickerComponent, FormsModule],
	template: \`
		<hlm-date-picker [min]="minDate" [max]="maxDate" [dateFormat]="dateFormat">
			<span>Pick a date</span>
		</hlm-date-picker>
	\`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormatExampleComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	public dateFormat = (date: Date) => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy');
}
`;
