import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-form',
	imports: [HlmDatePickerImports, ReactiveFormsModule, HlmButtonImports, HlmFieldImports],
	host: { class: 'w-full sm:max-w-sm' },
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="birthday">Date of birth</label>
					<hlm-date-picker [min]="minDate" [max]="maxDate" formControlName="birthday" [autoCloseOnSelect]="true">
						<hlm-date-picker-trigger buttonId="birthday">Pick a date</hlm-date-picker-trigger>
					</hlm-date-picker>
					<hlm-field-description>Your date of birth is used to calculate your age.</hlm-field-description>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class DatePickerFormExample {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		birthday: [null, Validators.required],
	});

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	submit() {
		console.log(this.form.value);
	}
}
