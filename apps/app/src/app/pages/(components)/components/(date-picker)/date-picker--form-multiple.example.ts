import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-date-picker-form-multiple',
	imports: [HlmDatePickerComponent, ReactiveFormsModule, HlmButtonDirective, HlmLabelDirective],
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<label hlmLabel>
				Available dates
				<hlm-date-picker mode="multiple" [min]="minDate" [max]="maxDate" formControlName="availableDates">
					<span>Pick a date</span>
				</hlm-date-picker>
			</label>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
		</form>
	`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormMultipleExampleComponent {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		availableDates: [[], Validators.required],
	});

	/** The selected date */
	public selectedDate = new Date();

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	submit() {
		console.log(this.form.value);
	}
}

export const datePickerFormMultipleCode = `
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmDatePickerComponent } from '@spartan-ng/ui-date-picker-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-date-picker-form-multiple',
	imports: [HlmDatePickerComponent, ReactiveFormsModule, HlmButtonDirective, HlmLabelDirective],
	template: \`
		<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-8">
			<label hlmLabel>
				Available dates
				<hlm-date-picker mode="multiple" [min]="minDate" [max]="maxDate" formControlName="availableDates">
					<span>Pick a date</span>
				</hlm-date-picker>
			</label>

			<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
		</form>
	\`,
	host: {
		class: 'preview flex min-h-[350px] w-full justify-center p-10 items-center',
	},
})
export class DatePickerFormMultipleExampleComponent {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		availableDates: [[], Validators.required],
	});

	/** The selected date */
	public selectedDate = new Date();

	/** The minimum date */
	public minDate = new Date(2023, 0, 1);

	/** The maximum date */
	public maxDate = new Date(2030, 11, 31);

	submit() {
		console.log(this.form.value);
	}
}
`;
