import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-calendar-date-picker',
	imports: [HlmDatePickerImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<hlm-field class="max-w-xs">
			<label hlmFieldLabel for="datePicker">Date Picker</label>
			<hlm-date-picker buttonId="datePicker" [(date)]="selectedDates" [min]="minDate" [max]="maxDate">
				<span>Pick dates</span>
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class CalendarDatePickerComponent {
	/** The selected date */
	public selectedDates = new Date();

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
