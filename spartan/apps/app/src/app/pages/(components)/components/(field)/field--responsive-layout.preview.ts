import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-field-responsive-layout-preview',
	imports: [HlmFieldImports, HlmInputImports, HlmTextareaImports, HlmButtonImports],
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
							<label hlmFieldLabel for="field-responsive-name">Name</label>
							<p hlmFieldDescription>Provide your full name for identification</p>
						</div>
						<input hlmInput id="field-responsive-name" type="text" placeholder="Alex Cooper" />
					</div>
					<hlm-field-separator />
					<div hlmField orientation="responsive">
						<div hlmFieldContent>
							<label hlmFieldLabel for="field-responsive-message">Message</label>
							<p hlmFieldDescription>
								You can write your message here. Keep it short, preferably under 100 characters.
							</p>
						</div>
						<textarea
							hlmTextarea
							id="field-responsive-message"
							placeholder="Hello, World!"
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
