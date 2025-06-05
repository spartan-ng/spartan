import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-label-preview',
	imports: [HlmLabelDirective, HlmInputDirective],
	template: `
		<label hlmLabel>
			E-Mail
			<input class="w-80" hlmInput type="email" placeholder="Email" />
		</label>
	`,
})
export class LabelPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
  selector: 'spartan-label-preview',
imports: [HlmLabelDirective, HlmInputDirective],
  template: \`
    <label hlmLabel>E-Mail
      <input class='w-80' hlmInput type='email' placeholder='Email'/>
    </label>
  \`,
})
export class LabelPreviewComponent {}

`;

export const defaultImports = `
import { HlmLabelDirective } from '@spartan-ng/helm/label';
`;
export const defaultSkeleton = '<label hlmLabel>Label<input/></label>';
