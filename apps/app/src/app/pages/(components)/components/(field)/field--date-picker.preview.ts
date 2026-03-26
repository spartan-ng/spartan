import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-field-date-picker-preview',
	imports: [ReactiveFormsModule, HlmButtonImports, HlmDatePickerImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'w-full max-w-xs',
	},
	template: `
		<fieldset hlmFieldSet>
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="date-range">Enter a date range</label>
					<hlm-date-picker buttonId="date-range">
						<span>Enter a date range</span>
					</hlm-date-picker>
				</hlm-field>
			</hlm-field-group>
		</fieldset>
	`,
})
export class FieldDatePickerPreview {}
