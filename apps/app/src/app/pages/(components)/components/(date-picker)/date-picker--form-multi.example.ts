import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-form-multiple',
	imports: [FormRoot, FormField, HlmDatePickerImports, HlmButtonImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full max-w-xs' },
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="date-available-dates">Available dates</label>
					<hlm-date-picker-multi
						[minDate]="minDate"
						[maxDate]="maxDate"
						[formField]="form.availableDates"
						[autoCloseOnMaxSelection]="true"
						[minSelection]="2"
						[maxSelection]="4"
					>
						<hlm-date-picker-trigger buttonId="date-available-dates">Pick dates</hlm-date-picker-trigger>
					</hlm-date-picker-multi>
				</hlm-field>

				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class DatePickerFormMultipleExample {
	protected readonly _model = signal<{ availableDates: Date[] }>({ availableDates: [] });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.availableDates, { message: 'Please select a date' });
			minLength(schemaPath.availableDates, 1, { message: 'Select at least one date' });
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
