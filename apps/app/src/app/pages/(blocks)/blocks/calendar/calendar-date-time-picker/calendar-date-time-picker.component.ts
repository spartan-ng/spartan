import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-calendar-date-and-time-picker',
	imports: [HlmDatePicker, HlmLabel, HlmInput],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
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
					class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none bg-background"
				/>
			</div>
		</div>
	`,
})
export class CalendarDateAndTimePickerComponent {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
