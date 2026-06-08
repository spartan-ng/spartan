import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-form-input',
	imports: [HlmDatePickerImports, ReactiveFormsModule, HlmButtonImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()">
			<hlm-field-group>
				<hlm-field>
					<label for="date-birthday-input" hlmFieldLabel>Date of birth</label>
					<hlm-date-picker
						captionLayout="dropdown"
						formControlName="birthday"
						[max]="maxDate"
						[defaultFocusedDate]="defaultFocusedDate"
						[formatDate]="formatDate"
					>
						<hlm-date-picker-input
							inputId="date-birthday-input"
							placeholder="dd.MM.yyyy"
							showClear
							[parseDate]="parseDate"
						/>
					</hlm-date-picker>
					<hlm-field-description>Type a date (dd.MM.yyyy) or pick one from the calendar.</hlm-field-description>
				</hlm-field>
				<hlm-field orientation="horizontal">
					<button type="submit" hlmBtn [disabled]="form.invalid">Submit</button>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class DatePickerFormInputExample {
	private readonly _formBuilder = inject(FormBuilder);

	public form = this._formBuilder.group({
		birthday: [null, Validators.required],
	});

	/** The maximum date */
	public maxDate = new Date();

	/** Open the calendar at "today minus 18 years" - a reasonable anchor for a date-of-birth picker. */
	public defaultFocusedDate = DateTime.now().minus({ years: 18 }).toJSDate();

	/** Format dates as `dd.MM.yyyy` (e.g. `01.07.2026`). */
	public formatDate = (date: Date): string => DateTime.fromJSDate(date).toFormat('dd.MM.yyyy');

	/** Parse `dd.MM.yyyy` strings back into `Date` instances. */
	public parseDate = (value: string): Date | undefined => {
		const dt = DateTime.fromFormat(value, 'dd.MM.yyyy');
		return dt.isValid ? dt.toJSDate() : undefined;
	};

	submit() {
		console.log(this.form.value);
	}
}
