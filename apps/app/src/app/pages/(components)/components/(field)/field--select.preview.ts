import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSelectImports } from '@spartan-ng/helm/select';

@Component({
	selector: 'spartan-field-select-preview',
	imports: [HlmFieldImports, HlmSelectImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<fieldset hlmFieldSet>
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel for="field-select-department">Department</label>
					<hlm-select class="inline-block" placeholder="Choose a department">
						<hlm-select-trigger />
						<hlm-select-content>
							<hlm-option value="engineering">Engineering</hlm-option>
							<hlm-option value="design">Design</hlm-option>
							<hlm-option value="marketing">Marketing</hlm-option>
							<hlm-option value="sales">Sales</hlm-option>
							<hlm-option value="support">Customer Support</hlm-option>
							<hlm-option value="hr">Human Resources</hlm-option>
							<hlm-option value="finance">Finance</hlm-option>
							<hlm-option value="operations">Operations</hlm-option>
						</hlm-select-content>
					</hlm-select>
					<p hlmFieldDescription>Select your department or area of work.</p>
				</div>
			</div>
		</fieldset>
	`,
})
export class FieldSelectPreview {}
