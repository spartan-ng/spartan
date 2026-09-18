import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-sizes',
	imports: [HlmFieldImports, HlmSwitch],
	host: { class: 'w-full max-w-40' },
	template: `
		<hlm-field-group>
			<hlm-field orientation="horizontal">
				<hlm-switch inputId="switch-size-sm" size="sm" />
				<label hlmFieldLabel for="switch-size-sm">Small</label>
			</hlm-field>
			<hlm-field orientation="horizontal">
				<hlm-switch inputId="switch-size-default" />
				<label hlmFieldLabel for="switch-size-default">Default</label>
			</hlm-field>
		</hlm-field-group>
	`,
})
export class SwitchSizes {}
