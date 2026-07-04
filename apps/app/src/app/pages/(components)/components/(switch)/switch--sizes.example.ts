import { Component } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-sizes',
	imports: [HlmLabel, HlmSwitch],
	host: {
		class: 'flex flex-wrap items-center gap-6',
	},
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" size="sm" />
			Small
		</label>
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" size="md" />
			Medium
		</label>
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" size="lg" />
			Large
		</label>
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="me-2" size="xl" />
			Extra large
		</label>
	`,
})
export class SwitchSizes {}
