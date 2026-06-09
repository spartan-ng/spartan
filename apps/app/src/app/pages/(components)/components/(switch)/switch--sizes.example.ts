import { Component } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-sizes',
	imports: [HlmLabel, HlmSwitch],
	host: {
		class: 'flex items-center gap-6',
	},
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" size="sm" />
			Small
		</label>
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" size="default" />
			Default
		</label>
	`,
})
export class SwitchSizes {}
