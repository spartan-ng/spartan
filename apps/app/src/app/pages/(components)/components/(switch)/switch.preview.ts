import { Component } from '@angular/core';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSwitch } from '@spartan-ng/helm/switch';

@Component({
	selector: 'spartan-switch-preview',
	imports: [HlmLabel, HlmSwitch],
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="mr-2" />
			Airplane mode
		</label>
	`,
})
export class SwitchPreview {}

export const defaultImports = `
import { HlmSwitch } from '@spartan-ng/helm/switch';
`;
export const defaultSkeleton = `
<hlm-switch />
`;
