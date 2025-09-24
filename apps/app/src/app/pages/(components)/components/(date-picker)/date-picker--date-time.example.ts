import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-and-time-picker',
	imports: [HlmDatePickerImports, HlmLabelImports, HlmInputImports],
	template: `
		<div class="flex gap-4">
			<div class="flex flex-col gap-3">
				<label for="date-picker" hlmLabel class="px-1">Date</label>
				<hlm-date-picker buttonId="date-picker" [min]="minDate" [max]="maxDate">
					<span>Select date</span>
				</hlm-date-picker>
			</div>

			<div class="flex flex-col gap-3">
				<label for="time-picker" hlmLabel class="px-1">Time</label>
				<input
					hlmInput
					id="time-picker"
					type="time"
					step="1"
					[defaultValue]="'10:30:00'"
					class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>
		</div>
	`,
})
export class DateAndTimePickerExample {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
