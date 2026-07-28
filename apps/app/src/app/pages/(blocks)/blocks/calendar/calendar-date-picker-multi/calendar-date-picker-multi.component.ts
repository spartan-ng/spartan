import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-calendar-date-picker-multi',
	imports: [FormRoot, FormField, HlmDatePickerImports, HlmButtonImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<form [formRoot]="form" class="w-full max-w-xs">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="availableDates">Available dates</label>
					<hlm-date-picker-multi
						[minDate]="minDate"
						[maxDate]="maxDate"
						[formField]="form.availableDates"
						[autoCloseOnMaxSelection]="true"
						[minSelection]="2"
						[maxSelection]="4"
					>
						<hlm-date-picker-trigger buttonId="availableDates">Pick dates</hlm-date-picker-trigger>
					</hlm-date-picker-multi>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form().submitting()">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class CalendarDatePickerMultiComponent {
	private readonly _model = signal<{ availableDates: Date[] }>({ availableDates: [] });

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.availableDates, { message: 'Please select a date' });
			minLength(schemaPath.availableDates, 1, { message: 'Select at least one date' });
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
