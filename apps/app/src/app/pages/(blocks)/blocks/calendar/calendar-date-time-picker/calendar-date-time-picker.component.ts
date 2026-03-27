import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-calendar-date-and-time-picker',
	imports: [HlmDatePickerImports, HlmFieldImports, HlmInputImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<hlm-field-group class="mx-auto max-w-xs flex-row">
			<hlm-field>
				<label hlmFieldLabel for="date-picker">Date</label>
				<hlm-date-picker buttonId="date-picker" [min]="minDate" [max]="maxDate">
					<span>Select date</span>
				</hlm-date-picker>
			</hlm-field>

			<hlm-field>
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
export class CalendarDateAndTimePickerComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
