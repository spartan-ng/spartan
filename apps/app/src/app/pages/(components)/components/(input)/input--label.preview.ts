import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-label',
	imports: [HlmInputDirective, HlmLabelDirective],
	template: `
		<div class="grid w-full max-w-sm items-center gap-3">
			<label for="email" hlmLabel>Email</label>
			<input hlmInput type="email" id="email" placeholder="Email" />
		</div>
	`,
})
export class InputLabelPreviewComponent {}
