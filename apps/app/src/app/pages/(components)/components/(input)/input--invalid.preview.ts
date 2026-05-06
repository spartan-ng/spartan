import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-invalid',
	imports: [HlmInputImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-sm' },
	template: `
		<hlm-field forceInvalid>
			<label hlmFieldLabel for="input-invalid">Invalid Input</label>
			<input hlmInput forceInvalid id="input-invalid" placeholder="Error" />
			<hlm-field-description>This field contains validation errors.</hlm-field-description>
		</hlm-field>
	`,
})
export class InputInvalid {}
