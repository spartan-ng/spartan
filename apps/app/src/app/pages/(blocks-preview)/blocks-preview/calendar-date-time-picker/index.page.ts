import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-calendar-date-and-time-picker',
	imports: [HlmDatePicker, HlmLabel, HlmInput],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex pt-20 justify-center',
	},
	styleUrl: '../../blocks-preview-default.css',
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
export default class CalendarDateAndTimePickerPage {
	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
