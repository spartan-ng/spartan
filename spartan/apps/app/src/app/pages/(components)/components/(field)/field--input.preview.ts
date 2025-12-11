import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-field-input-preview',
	imports: [HlmFieldImports, HlmInputImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<fieldset hlmFieldSet>
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel for="field-input-preview-firstname">Username</label>
					<input hlmInput id="field-input-preview-firstname" type="text" placeholder="Alex Cooper" />
					<p hlmFieldDescription>Choose a unique username for your account.</p>
				</div>
				<div hlmField>
					<label hlmFieldLabel for="field-input-preview-password">Password</label>
					<p hlmFieldDescription>Must be at least 8 characters long.</p>
					<input hlmInput id="field-input-preview-password" type="password" placeholder="••••••••" />
				</div>
			</div>
		</fieldset>
	`,
})
export class FieldInputPreview {}
