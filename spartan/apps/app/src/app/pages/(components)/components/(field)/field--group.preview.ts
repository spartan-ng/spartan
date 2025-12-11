import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-field-group-preview',
	imports: [HlmFieldImports, HlmCheckboxImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<div hlmFieldGroup>
			<fieldset hlmFieldSet>
				<label hlmFieldLabel>Response</label>
				<p hlmFieldDescription>
					Get notified when ChatGPT responds to requests that take time, like research or image generation.
				</p>
				<div hlmFieldGroup data-slot="checkbox-group">
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-group-push-notifications" disabled [checked]="true" />
						<label hlmFieldLabel for="field-group-push-notifications" class="font-normal">Push notifications</label>
					</div>
				</div>
			</fieldset>
			<hlm-field-separator />
			<fieldset hlmFieldSet>
				<label hlmFieldLabel>Tasks</label>
				<p hlmFieldDescription>
					Get notified when tasks you've created have updates.
					<a href="#">Manage tasks</a>
				</p>
				<div hlmFieldGroup data-slot="checkbox-group">
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-group-push-task" />
						<label hlmFieldLabel for="field-group-push-task" class="font-normal">Push notifications</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-group-email-task" />
						<label hlmFieldLabel for="field-group-email-task" class="font-normal">Email notifications</label>
					</div>
				</div>
			</fieldset>
		</div>
	`,
})
export class FieldGroupPreview {}
