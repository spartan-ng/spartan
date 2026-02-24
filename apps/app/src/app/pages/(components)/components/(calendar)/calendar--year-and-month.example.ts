import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-calendar-year-and-month',
	imports: [HlmCalendar, HlmSelectImports, FormsModule],
	host: {
		class: 'flex flex-col gap-4',
	},
	template: `
		<hlm-calendar [captionLayout]="_captionLayout()" />

		<hlm-select class="inline-block" placeholder="Select an option" [(ngModel)]="_captionLayout">
			<hlm-select-trigger />
			<hlm-select-content>
				<hlm-option value="dropdown">Month and Year</hlm-option>
				<hlm-option value="dropdown-months">Only Month</hlm-option>
				<hlm-option value="dropdown-years">Only Year</hlm-option>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class CalendarYearAndMonthExample {
	protected readonly _captionLayout = model<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('dropdown');
}
