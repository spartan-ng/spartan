import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-field-set-preview',
	imports: [HlmFieldImports, HlmInputImports],
	host: {
		class: 'w-full max-w-md space-y-6',
	},
	template: `
		<fieldset hlmFieldSet>
			<legend hlmFieldLegend>Address Information</legend>
			<p hlmFieldDescription>Choose a unique username for your account.</p>
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel for="field-set-street-address">Street Address</label>
					<input hlmInput id="field-set-street-address" type="text" placeholder="123 Main St" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div hlmField>
						<label hlmFieldLabel for="field-set-city">City</label>
						<input hlmInput id="field-set-city" type="text" placeholder="Los Angeles" />
					</div>
					<div hlmField>
						<label hlmFieldLabel for="field-set-postal-code">Postal Code</label>
						<input hlmInput id="field-set-postal-code" type="text" placeholder="90502" />
					</div>
				</div>
			</div>
		</fieldset>
	`,
})
export class FieldSetPreview {}
