import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

@Component({
	selector: 'spartan-field-checkbox',
	imports: [HlmFieldImports, HlmCheckbox],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<fieldset hlmFieldSet>
			<label hlmFieldLabel for="exp-checkbox">
				<div hlmField orientation="horizontal">
					<hlm-checkbox id="exp-checkbox" [checked]="true" />
					<label hlmFieldLabel for="exp-checkbox">I agree to the terms and conditions</label>
				</div>
			</label>
		</fieldset>
	`,
})
export class FieldCheckbox {}
