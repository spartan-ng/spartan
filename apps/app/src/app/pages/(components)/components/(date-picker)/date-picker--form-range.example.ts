import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-date-picker-form-range',
	imports: [ReactiveFormsModule, HlmButtonImports, HlmFieldImports, HlmDatePickerImports],
	host: { class: 'w-full sm:max-w-sm' },
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="dateRange">Enter a date range</label>
					<hlm-date-range-picker
						[min]="minDate"
						[max]="maxDate"
						formControlName="range"
						[autoCloseOnEndSelection]="true"
					>
						<hlm-date-picker-trigger buttonId="dateRange">Pick a range</hlm-date-picker-trigger>
					</hlm-date-range-picker>
				</hlm-field>

				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class DatePickerFormRangeExample {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		range: [[], [Validators.required]],
	});

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	submit() {
		console.log(this.form.value);
	}

	constructor() {
		this.form.get('range')?.valueChanges.subscribe(console.log);
	}
}
