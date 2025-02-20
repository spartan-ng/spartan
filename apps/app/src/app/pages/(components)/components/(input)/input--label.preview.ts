import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
	selector: 'spartan-input-label',
	imports: [HlmInputDirective, HlmLabelDirective],
	template: `
		<label hlmLabel>
			Email
			<input class="w-80" hlmInput type="email" placeholder="Email" />
		</label>
	`,
})
export class InputLabelPreviewComponent {}

export const labelCode = `
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'spartan-input-label',
  standalone: true,
  imports: [HlmInputDirective, HlmLabelDirective],
  template: \` <label hlmLabel
    >Email
    <input class="w-80" hlmInput type="email" placeholder="Email" />
  </label>\`,
})
export class InputLabelPreviewComponent {}
`;
