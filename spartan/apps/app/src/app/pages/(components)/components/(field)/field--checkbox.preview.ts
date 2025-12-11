import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-field-checkbox-preview',
	imports: [HlmFieldImports, HlmCheckboxImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<div hlmFieldGroup>
			<fieldset hlmFieldSet>
				<legend hlmFieldLegend variant="label">Show these items on the desktop</legend>
				<p hlmFieldDescription>Select the items you want to show on the desktop.</p>
				<div hlmFieldGroup class="gap-3">
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-hard-disks" />
						<label hlmFieldLabel for="field-hard-disks" class="font-normal">Hard disks</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-external-disks" />
						<label hlmFieldLabel for="field-external-disks" class="font-normal">External disks</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-cds-dvds-ipods" />
						<label hlmFieldLabel for="field-cds-dvds-ipods" class="font-normal">CDs, DVDs, and IPods</label>
					</div>
					<div hlmField orientation="horizontal">
						<hlm-checkbox id="field-connected-servers" />
						<label hlmFieldLabel for="field-connected-servers" class="font-normal">Connected servers</label>
					</div>
				</div>
			</fieldset>
			<hlm-field-separator />
			<div hlmField orientation="horizontal">
				<hlm-checkbox id="field-sync-desktop-documents" [checked]="true" />
				<div hlmFieldContent>
					<label hlmFieldLabel for="field-sync-desktop-documents">Sync Desktop & Documents folders</label>
					<p hlmFieldDescription>
						Your Desktop & Documents folders are being synced with iCloud Drive. You can access them from other devices.
					</p>
				</div>
			</div>
		</div>
	`,
})
export class FieldCheckboxPreview {}
