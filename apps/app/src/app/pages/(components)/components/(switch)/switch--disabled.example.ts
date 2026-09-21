import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-disabled',
	imports: [HlmFieldImports, HlmSwitch],
	template: `
		<hlm-field orientation="horizontal" data-disabled="true">
			<hlm-switch inputId="switch-disabled" disabled />
			<label hlmFieldLabel for="switch-disabled">Disabled</label>
		</hlm-field>
	`,
})
export class SwitchDisabled {}
