import { ChangeDetectionStrategy, Component, model, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-calendar-month-and-year',
	imports: [HlmCalendar, BrnSelectImports, HlmSelectImports, FormsModule],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col gap-4 pt-20 items-center',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<hlm-calendar [captionLayout]="_captionLayout()" />

		<brn-select class="inline-block" placeholder="Select an option" [(ngModel)]="_captionLayout">
			<hlm-select-trigger class="w-full">
				<hlm-select-value />
			</hlm-select-trigger>
			<hlm-select-content>
				<hlm-option value="dropdown">Month and Year</hlm-option>
				<hlm-option value="dropdown-months">Only Month</hlm-option>
				<hlm-option value="dropdown-years">Only Year</hlm-option>
			</hlm-select-content>
		</brn-select>
	`,
})
export default class CalendarMonthAndYearPage {
	protected readonly _captionLayout = model<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('dropdown');
}
