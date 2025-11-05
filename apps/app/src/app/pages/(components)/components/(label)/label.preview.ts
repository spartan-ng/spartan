import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-label-preview',
	imports: [HlmLabelImports, HlmCheckboxImports],
	template: `
		<div>
			<div class="flex items-center gap-2">
				<hlm-checkbox id="terms" />
				<label hlmLabel for="terms">Accept terms and conditions</label>
			</div>
		</div>
	`,
})
export class LabelPreview {}

export const defaultImports = `
import { HlmLabelImports } from '@spartan-ng/helm/label';
`;
export const defaultSkeleton = '<label hlmLabel>Label</label>';
