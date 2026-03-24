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

		<hlm-select class="inline-block" [(ngModel)]="_captionLayout" [itemToString]="itemToString">
			<hlm-select-trigger class="w-full">
				<hlm-select-value placeholder="Select an option" />
			</hlm-select-trigger>
			<hlm-select-content *hlmSelectPortal>
				<hlm-select-group>
					<hlm-select-item value="dropdown">Month and Year</hlm-select-item>
					<hlm-select-item value="dropdown-months">Only Month</hlm-select-item>
					<hlm-select-item value="dropdown-years">Only Year</hlm-select-item>
				</hlm-select-group>
			</hlm-select-content>
		</hlm-select>
	`,
})
export class CalendarYearAndMonthExample {
	protected readonly _captionLayout = model<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('dropdown');

	public readonly options = [
		{ value: 'dropdown', label: 'Month and Year' },
		{ value: 'dropdown-months', label: 'Only Month' },
		{ value: 'dropdown-years', label: 'Only Year' },
	];

	public readonly itemToString = (value: string) => this.options.find((option) => option.value === value)?.label || '';
}
