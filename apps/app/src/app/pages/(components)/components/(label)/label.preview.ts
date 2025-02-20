import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

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
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'spartan-label-preview',
  standalone: true,
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
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
`;
export const defaultSkeleton = '<label hlmLabel>Label<input/></label>';
