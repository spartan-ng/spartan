import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-label-preview',
	imports: [HlmLabelImports, HlmCheckboxImports],
	template: `
		<div class="flex gap-2">
			<hlm-checkbox inputId="terms" />
			<label hlmLabel for="terms">Accept terms and conditions</label>
		</div>
	`,
})
export class LabelPreview {}

export const defaultImports = `
import { HlmLabelImports } from '@spartan-ng/helm/label';
`;
export const defaultSkeleton = '<label hlmLabel for="email">Your email address</label>';
