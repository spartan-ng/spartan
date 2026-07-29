import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-form',
	imports: [HlmDatePickerImports, FormRoot, FormField, HlmButtonImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<hlm-field>
					<label for="date-birthday" hlmFieldLabel>Date of birth</label>
					<hlm-date-picker
						[minDate]="minDate"
						[maxDate]="maxDate"
						captionLayout="dropdown"
						[formField]="form.birthday"
						[autoCloseOnSelect]="true"
					>
						<hlm-date-picker-trigger buttonId="date-birthday">Pick a date</hlm-date-picker-trigger>
					</hlm-date-picker>
					<hlm-field-description>Your date of birth is used to calculate your age.</hlm-field-description>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class DatePickerFormExample {
	protected readonly _model = signal<{ birthday: Date | null }>({ birthday: null });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.birthday, { message: 'Please select a date' });
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
