import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { DateTime } from 'luxon';

@Component({
	selector: 'spartan-date-picker-input-example',
	imports: [HlmDatePickerImports, HlmFieldImports],
	template: `
		<hlm-field>
			<label hlmFieldLabel for="date-input">Date of birth</label>
			<hlm-date-picker
				captionLayout="dropdown"
				[max]="maxDate"
				[defaultFocusedDate]="defaultFocusedDate"
				[formatDate]="formatDate"
			>
				<hlm-date-picker-input inputId="date-input" placeholder="dd.MM.yyyy" [parseDate]="parseDate" />
			</hlm-date-picker>
		</hlm-field>
	`,
})
export class DatePickerInputExample {
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
}
