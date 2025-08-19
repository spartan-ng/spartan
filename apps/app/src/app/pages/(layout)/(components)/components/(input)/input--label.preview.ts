import { Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-label',
	imports: [HlmInput, HlmLabel],
	template: `
		<div class="grid w-full max-w-sm items-center gap-3">
			<label for="email" hlmLabel>Email</label>
			<input hlmInput type="email" id="email" placeholder="Email" />
		</div>
	`,
})
export class InputLabelPreview {}
