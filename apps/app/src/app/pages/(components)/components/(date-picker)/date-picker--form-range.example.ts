import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-form-range',
	imports: [ReactiveFormsModule, HlmButtonImports, HlmLabelImports, HlmDatePickerImports],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="dateRange" hlmLabel class="px-1">Enter a date range</label>
				<hlm-date-range-picker
					buttonId="dateRange"
					[min]="minDate"
					[max]="maxDate"
					formControlName="range"
					[autoCloseOnEndSelection]="true"
				>
					<span>Enter a date range</span>
				</hlm-date-range-picker>
			</div>

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
