import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-calendar-date-picker-range',
	imports: [FormRoot, FormField, HlmDatePickerImports, HlmFieldImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<form [formRoot]="form" class="w-full max-w-xs">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="dateRange">Enter a date range</label>
					<hlm-date-range-picker
						[minDate]="minDate"
						[maxDate]="maxDate"
						[formField]="form.range"
						[autoCloseOnEndSelection]="true"
					>
						<hlm-date-picker-trigger buttonId="dateRange">Enter a date range</hlm-date-picker-trigger>
					</hlm-date-range-picker>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class CalendarDatePickerRangeComponent {
	private readonly _model = signal<{ range: [Date, Date] | null }>({ range: null });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.range, { message: 'Please select a date range' });
		},
		{
			submission: {
				action: async () => {
					console.log(this._model());
				},
			},
		},
	);

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
