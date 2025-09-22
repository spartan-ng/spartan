import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-form',
	imports: [HlmDatePickerImports, ReactiveFormsModule, HlmButtonImports, HlmLabelImports],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<div class="flex flex-col gap-2">
				<label for="birthday" hlmLabel class="px-1">Date of birth</label>
				<hlm-date-picker
					buttonId="birthday"
					[min]="minDate"
					[max]="maxDate"
					formControlName="birthday"
					[autoCloseOnSelect]="true"
				>
					<span>Pick a date</span>
				</hlm-date-picker>
				<div class="text-muted-foreground px-1 text-sm">Your date of birth is used to calculate your age.</div>
			</div>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
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
