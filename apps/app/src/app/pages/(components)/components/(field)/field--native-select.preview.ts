import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';

@Component({
	selector: 'spartan-field-native-select-preview',
	imports: [HlmFieldImports, HlmNativeSelectImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<fieldset hlmFieldSet>
			<hlm-field-group>
				<hlm-field>
					<label hlmFieldLabel for="field-native-select-department">Department</label>
					<hlm-native-select selectId="field-native-select-department">
						<option hlmNativeSelectOption value="">Choose department</option>
						<option hlmNativeSelectOption value="engineering">Engineering</option>
						<option hlmNativeSelectOption value="design">Design</option>
						<option hlmNativeSelectOption value="marketing">Marketing</option>
						<option hlmNativeSelectOption value="sales">Sales</option>
						<option hlmNativeSelectOption value="support">Customer Support</option>
						<option hlmNativeSelectOption value="hr">Human Resources</option>
						<option hlmNativeSelectOption value="finance">Finance</option>
						<option hlmNativeSelectOption value="operations">Operations</option>
					</hlm-native-select>
					<hlm-field-description>Select your department or area of work.</hlm-field-description>
				</hlm-field>
			</hlm-field-group>
		</fieldset>
	`,
})
export class FieldNativeSelectPreview {}
