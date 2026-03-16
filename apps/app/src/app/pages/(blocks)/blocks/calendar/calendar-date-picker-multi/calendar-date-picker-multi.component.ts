import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-calendar-date-picker-multi',
	imports: [ReactiveFormsModule, HlmDatePickerImports, HlmButtonImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="w-full max-w-xs">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="availableDates">Available dates</label>
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
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class CalendarDatePickerMultiComponent {
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
