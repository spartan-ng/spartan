import { Component } from '@angular/core';
import { HlmCheckboxComponent } from '@spartan-ng/helm/checkbox';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-checkbox-preview',
	imports: [HlmLabelDirective, HlmCheckboxComponent],
	template: `
		<label class="flex items-center" hlmLabel>
			<hlm-checkbox class="mr-2" />
			Accept terms and conditions
		</label>
	`,
})
export class CheckboxPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmCheckboxComponent } from '@spartan-ng/helm/checkbox';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
@Component({
	selector: 'spartan-checkbox-preview',
imports: [HlmLabelDirective, HlmCheckboxComponent ],
	template: \`
		<label class="flex items-center" hlmLabel>
			<hlm-checkbox class="mr-2" />
			Accept terms and conditions
		</label>
	\`,
})
export class CheckboxPreviewComponent {}
`;

export const defaultImports = `
import { HlmCheckboxComponent } from '@spartan-ng/helm/checkbox';
`;
export const defaultSkeleton = `
<hlm-checkbox />
`;
