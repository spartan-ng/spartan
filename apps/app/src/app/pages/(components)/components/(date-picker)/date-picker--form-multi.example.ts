import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-form-multiple',
	imports: [HlmDatePickerImports, ReactiveFormsModule, HlmButtonImports, HlmLabelImports],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="availableDates" hlmLabel class="px-1">Available dates</label>
				<hlm-date-picker-multi
					buttonId="availableDates"
					[min]="minDate"
					[max]="maxDate"
					formControlName="availableDates"
					[autoCloseOnMaxSelection]="true"
					[minSelection]="2"
					[maxSelection]="4"
				>
					<span>Pick dates</span>
				</hlm-date-picker-multi>
			</div>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
		</form>
	`,
})
export class DatePickerFormMultipleExample {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		availableDates: [[], Validators.required],
	});

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	submit() {
		console.log(this.form.value);
	}
}
