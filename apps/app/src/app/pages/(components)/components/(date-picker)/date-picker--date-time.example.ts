import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-date-and-time-picker',
	imports: [HlmDatePickerImports, HlmFieldImports, HlmInputImports],
	host: { class: 'w-full sm:max-w-sm' },
	template: `
		<hlm-field-group class="max-w-xs flex-row">
			<hlm-field>
				<label hlmFieldLabel for="date-picker">Date</label>
				<hlm-date-picker [min]="minDate" [max]="maxDate">
					<hlm-date-picker-trigger buttonId="date-picker">Select date</hlm-date-picker-trigger>
				</hlm-date-picker>
			</hlm-field>

			<hlm-field class="w-32">
				<label hlmFieldLabel for="time-picker">Time</label>
				<input
					hlmInput
					id="time-picker"
					type="time"
					step="1"
					[defaultValue]="'10:30:00'"
					class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</hlm-field>
		</hlm-field-group>
	`,
})
export class DateAndTimePickerExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
