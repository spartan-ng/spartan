import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-field-textarea-preview',
	imports: [HlmFieldImports, HlmTextareaImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<fieldset hlmFieldSet>
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel for="field-input-preview-firstname">Feedback</label>
					<textarea
						hlmTextarea
						id="field-input-preview-firstname"
						placeholder="Your feedback helps us improve..."
					></textarea>
					<p hlmFieldDescription>Share your thoughts about our service.</p>
				</div>
			</div>
		</fieldset>
	`,
})
export class FieldTextareaPreview {}
