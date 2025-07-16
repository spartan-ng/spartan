import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-label-preview',
	imports: [HlmLabel, HlmCheckboxImports],
	template: `
		<div>
			<div class="flex items-center space-x-2">
				<hlm-checkbox id="terms" />
				<label hlmLabel for="terms">Accept terms and conditions</label>
			</div>
		</div>
	`,
})
export class LabelPreview {}

export const defaultImports = `
import { HlmLabelDirective } from '@spartan-ng/helm/label';
`;
export const defaultSkeleton = '<label hlmLabel>Label</label>';
