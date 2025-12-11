import { Component, signal } from '@angular/core';
import { HlmField, HlmFieldDescription, HlmFieldGroup, HlmFieldLabel, HlmFieldSet } from '@spartan-ng/helm/field';
import { HlmSliderImports } from '@spartan-ng/helm/slider';

@Component({
	selector: 'spartan-field-slider-preview',
	imports: [HlmFieldSet, HlmFieldGroup, HlmField, HlmFieldLabel, HlmFieldDescription, HlmSliderImports],
	host: {
		class: 'w-full max-w-md',
	},
	template: `
		<fieldset hlmFieldSet>
			<div hlmFieldGroup>
				<div hlmField>
					<label hlmFieldLabel for="field-input-preview-firstname">Price Range</label>
					<p hlmFieldDescription>Set your budget range ($0 - {{ value() }}).</p>
					<hlm-slider [max]="1000" [step]="10" [(value)]="value" />
				</div>
			</div>
		</fieldset>
	`,
})
export class FieldSliderPreview {
	public readonly value = signal(500);
}
