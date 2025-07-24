import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDatePicker } from '@spartan-ng/helm/date-picker';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-date-picker-form',
	imports: [HlmDatePicker, ReactiveFormsModule, HlmButton, HlmLabel],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<label hlmLabel>
				Date of birth
				<hlm-date-picker [min]="minDate" [max]="maxDate" formControlName="birthday" [autoCloseOnSelect]="true">
					<span>Pick a date</span>
				</hlm-date-picker>
			</label>

			<button type="submit" hlmBtn>Submit</button>
		</form>
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
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
