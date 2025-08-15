import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDateRangePicker } from '@spartan-ng/helm/date-picker';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-form-range',
	imports: [ReactiveFormsModule, HlmButton, HlmLabel, HlmDateRangePicker],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<label hlmLabel>
				Enter a date range
				<hlm-date-range-picker [min]="minDate" [max]="maxDate" formControlName="range" [autoCloseOnEndSelection]="true">
					<span>Enter a date range</span>
				</hlm-date-range-picker>
			</label>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
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
