import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-calendar-month-and-year-dropdown',
	imports: [HlmCalendar, BrnSelectImports, HlmSelectImports, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<div class="flex w-max flex-col gap-2">
			<hlm-calendar calendarClass="bg-background" [captionLayout]="_captionLayout()" />

			<brn-select class="bg-background" [(ngModel)]="_captionLayout">
				<hlm-select-trigger class="w-full">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content>
					<hlm-option value="dropdown">Month and Year</hlm-option>
					<hlm-option value="dropdown-months">Only Month</hlm-option>
					<hlm-option value="dropdown-years">Only Year</hlm-option>
				</hlm-select-content>
			</brn-select>
		</div>
	`,
})
export class CalendarMonthAndYearComponent {
	protected readonly _captionLayout = model<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('dropdown');
}
