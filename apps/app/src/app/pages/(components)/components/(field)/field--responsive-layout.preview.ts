import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-field-responsive-layout-preview',
	imports: [HlmFieldImports, HlmInput, HlmTextarea, HlmButton],
	host: {
		class: 'w-full max-w-4xl',
	},
	template: `
		<form>
			<fieldset hlmFieldSet>
				<legend hlmFieldLegend>Profile</legend>
				<p hlmFieldDescription>Fill in your profile information.</p>
				<hlm-field-separator />
				<div hlmFieldGroup>
					<div hlmField orientation="responsive">
						<div hlmFieldContent>
							<label hlmFieldLabel for="field-input-preview-firstname">Name</label>
							<p hlmFieldDescription>Provide your full name for identification</p>
						</div>
						<input hlmInput id="field-input-preview-firstname" type="text" placeholder="Alex Cooper" />
					</div>
					<hlm-field-separator />
					<div hlmField orientation="responsive">
						<div hlmFieldContent>
							<label hlmFieldLabel for="field-input-preview-firstname">Name</label>
							<p hlmFieldDescription>Provide your full name for identification</p>
						</div>
						<textarea
							hlmTextarea
							id="field-input-preview-firstname"
							placeholder="Alex Cooper"
							class="min-h-[100px] resize-none sm:min-w-[300px]"
						></textarea>
					</div>
					<hlm-field-separator />
					<div hlmField orientation="responsive">
						<button hlmBtn type="submit">Submit</button>
						<button hlmBtn type="button" variant="outline">Cancel</button>
					</div>
				</div>
			</fieldset>
		</form>
	`,
})
export class FieldResponsiveLayoutPreview {}
