import { Component } from '@angular/core';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-field-group-preview',
	imports: [HlmFieldImports, HlmCheckbox],
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
						<hlm-checkbox id="field-hard-disks" disabled [checked]="true" />
						<label hlmFieldLabel for="field-hard-disks" class="font-normal">Hard disks</label>
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
				<div hlmFieldGroup class="gap-3" data-slot="checkbox-group">
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-hard-disks" [checked]="true" />
						<label hlmFieldLabel for="field-hard-disks" class="font-normal">Hard disks</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-hard-disks" [checked]="true" />
						<label hlmFieldLabel for="field-hard-disks" class="font-normal">Hard disks</label>
					</div>
				</div>
			</fieldset>
		</div>
	`,
})
export class FieldGroupPreview {}
