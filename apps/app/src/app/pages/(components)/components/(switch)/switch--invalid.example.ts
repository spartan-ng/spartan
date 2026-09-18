import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-invalid',
	imports: [HlmFieldImports, HlmSwitch],
	template: `
		<hlm-field orientation="horizontal" class="max-w-sm" forceInvalid>
			<hlm-field-content>
				<label hlmFieldLabel for="switch-invalid">Accept terms and conditions</label>
				<p hlmFieldDescription>You must accept the terms and conditions to continue.</p>
			</hlm-field-content>
			<hlm-switch inputId="switch-invalid" forceInvalid />
		</hlm-field>
	`,
})
export class SwitchInvalid {}
