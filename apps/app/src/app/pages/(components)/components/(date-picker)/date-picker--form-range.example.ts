import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-form-range',
	imports: [FormRoot, FormField, HlmButtonImports, HlmDatePickerImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full max-w-xs' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="date-range-form">Enter a date range</label>
					<hlm-date-range-picker
						[minDate]="minDate"
						[maxDate]="maxDate"
						[formField]="form.range"
						[autoCloseOnEndSelection]="true"
					>
						<hlm-date-picker-trigger buttonId="date-range-form">Pick date range</hlm-date-picker-trigger>
					</hlm-date-range-picker>
				</hlm-field>

				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class DatePickerFormRangeExample {
	protected readonly _model = signal<{ range: [Date, Date] | null }>({ range: null });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.range, { message: 'Please select a date' });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
				},
			},
		},
	);

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);
}
