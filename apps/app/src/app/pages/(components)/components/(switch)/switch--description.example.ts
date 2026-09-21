import { Component } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-description',
	imports: [HlmFieldImports, HlmSwitch],
	template: `
		<hlm-field orientation="horizontal" class="max-w-sm">
			<hlm-field-content>
				<label hlmFieldLabel for="switch-focus-mode">Share across devices</label>
				<p hlmFieldDescription>Focus is shared across devices, and turns off when you leave the app.</p>
			</hlm-field-content>
			<hlm-switch inputId="switch-focus-mode" />
		</hlm-field>
	`,
})
export class SwitchDescription {}
