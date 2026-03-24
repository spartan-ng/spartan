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
					<hlm-select [itemToString]="itemToString">
						<hlm-select-trigger class="w-full" buttonId="field-select-department">
							<hlm-select-value placeholder="Choose a department" />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							<hlm-select-group>
								@for (department of departments; track department.value) {
									<hlm-select-item [value]="department.value">
										{{ department.label }}
									</hlm-select-item>
								}
							</hlm-select-group>
						</hlm-select-content>
					</hlm-select>
					<p hlmFieldDescription>Select your department or area of work.</p>
				</div>
			</div>
		</fieldset>
	`,
})
export class FieldSelectPreview {
	public readonly departments = [
		{ value: 'engineering', label: 'Engineering' },
		{ value: 'design', label: 'Design' },
		{ value: 'marketing', label: 'Marketing' },
		{ value: 'sales', label: 'Sales' },
		{ value: 'support', label: 'Customer Support' },
		{ value: 'hr', label: 'Human Resources' },
		{ value: 'finance', label: 'Finance' },
		{ value: 'operations', label: 'Operations' },
	];

	public readonly itemToString = (value: string) => this.departments.find((d) => d.value === value)?.label ?? '';
}
