import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-calendar-date-picker',
	imports: [HlmDatePicker, HlmLabel],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex pt-20 justify-center',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div class="mt-10 flex flex-col gap-3">
			<label for="datePicker" hlmLabel class="px-1">Date Picker</label>
			<hlm-date-picker buttonId="datePicker" [(date)]="selectedDates" [min]="minDate" [max]="maxDate" />
		</div>
	`,
})
export default class CalendarDatePickerPage {
	/** The selected date */
	public selectedDates = new Date();

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
