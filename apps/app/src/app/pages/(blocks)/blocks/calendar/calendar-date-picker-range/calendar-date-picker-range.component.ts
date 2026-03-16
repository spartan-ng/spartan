import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-calendar-date-picker-range',
	imports: [ReactiveFormsModule, HlmDatePickerImports, HlmFieldImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex justify-center p-3 md:p-20 w-full h-auto md:h-[600px] bg-surface rounded-lg overflow-auto',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="w-full max-w-xs">
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="dateRange">Enter a date range</label>
					<hlm-date-range-picker
						buttonId="dateRange"
						[min]="minDate"
						[max]="maxDate"
						formControlName="range"
						[autoCloseOnEndSelection]="true"
					>
						<span>Enter a date range</span>
					</hlm-date-range-picker>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class CalendarDatePickerRangeComponent {
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
