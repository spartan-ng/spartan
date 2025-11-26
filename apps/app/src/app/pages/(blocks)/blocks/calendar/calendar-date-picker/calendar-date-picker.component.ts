import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-calendar-date-picker',
	imports: [HlmDatePicker, HlmLabel],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<div class="flex flex-col gap-3">
			<label for="datePicker" hlmLabel class="px-1">Date Picker</label>
			<hlm-date-picker buttonId="datePicker" [(date)]="selectedDates" [min]="minDate" [max]="maxDate" />
		</div>
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
