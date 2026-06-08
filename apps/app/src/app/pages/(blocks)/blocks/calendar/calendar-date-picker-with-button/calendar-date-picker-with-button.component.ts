import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-calendar-date-picker-with-button',
	imports: [HlmFieldImports, HlmDatePickerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<hlm-field class="max-w-xs">
			<label hlmFieldLabel for="datePickerWithButton">Date Picker with Button</label>
			<hlm-date-picker #datePicker [min]="minDate" [max]="maxDate" [formatDate]="formatDate">
				<hlm-date-picker-trigger buttonId="datePickerWithButton">Pick a date</hlm-date-picker-trigger>
				<div hlmDatePickerFooter class="flex justify-end gap-2 p-2">
					<button hlmBtn (click)="datePicker.close()">Submit</button>
					<button hlmBtn (click)="datePicker.reset()">Clear</button>
				</div>
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class CalendarDatePickerWithButtonComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	/** Overrides global formatDate  */
	public formatDate = (date: Date) => DateTime.fromJSDate(date).toFormat('MMMM dd, yyyy');
}
