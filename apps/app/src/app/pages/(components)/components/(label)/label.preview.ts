import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-label-preview',
	imports: [HlmLabelDirective, HlmCheckboxImports],
	template: `
		<div>
			<div class="flex items-center space-x-2">
				<hlm-checkbox id="terms" />
				<label hlmLabel for="terms">Accept terms and conditions</label>
			</div>
		</div>
	`,
})
export class LabelPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-label-preview',
	imports: [HlmLabelDirective, HlmCheckboxImports],
	template: \`
		<div>
			<div class="flex items-center space-x-2">
				<hlm-checkbox id="terms" />
				<label hlmLabel for="terms">Accept terms and conditions</label>
			</div>
		</div>
	\`,
})
export class LabelPreviewComponent {}`;

export const defaultImports = `
import { HlmLabelDirective } from '@spartan-ng/helm/label';
`;
export const defaultSkeleton = '<label hlmLabel>Label</label>';
