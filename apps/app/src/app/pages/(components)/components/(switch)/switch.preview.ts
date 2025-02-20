import { Component } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';

@Component({
	selector: 'spartan-switch-preview',
	imports: [HlmLabelDirective, HlmSwitchComponent],
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="mr-2" />
			Airplane mode
		</label>
	`,
})
export class SwitchPreviewComponent {}

export const defaultCode = `import { Component } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';

@Component({
	selector: 'spartan-switch-preview',
	standalone: true,
	imports: [HlmLabelDirective, HlmSwitchComponent],
	template: \`
		<label class="flex items-center" hlmLabel>
			<hlm-switch class="mr-2" />
			Airplane mode
		</label>
	\`,
})
export class SwitchPreviewComponent {}
`;

export const defaultImports = `
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
`;
export const defaultSkeleton = `
<hlm-switch />
`;
