import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmCalendar } from '@spartan-ng/helm/calendar';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-calendar-month-and-year-dropdown',
	imports: [HlmCalendar, HlmSelectImports, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<div class="flex w-max flex-col gap-2">
			<hlm-calendar calendarClass="bg-background" [captionLayout]="_captionLayout()" />

			<hlm-select class="bg-background" [(ngModel)]="_captionLayout" [itemToString]="itemToString">
				<hlm-select-trigger class="w-full">
					<hlm-select-value />
				</hlm-select-trigger>
				<hlm-select-content *hlmSelectPortal>
					<hlm-select-group>
						@for (option of options; track option.value) {
							<hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
						}
					</hlm-select-group>
				</hlm-select-content>
			</hlm-select>
		</div>
	`,
})
export class CalendarMonthAndYearComponent {
	protected readonly _captionLayout = model<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('dropdown');

	public readonly options = [
		{ value: 'dropdown', label: 'Month and Year' },
		{ value: 'dropdown-months', label: 'Only Month' },
		{ value: 'dropdown-years', label: 'Only Year' },
	];

	public readonly itemToString = (value: string) => this.options.find((option) => option.value === value)?.label || '';
}
