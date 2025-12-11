import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-label',
	imports: [HlmInputImports, HlmLabelImports],
	template: `
		<div class="grid w-full max-w-sm items-center gap-3">
			<label hlmLabel for="email">Email</label>
			<input hlmInput type="email" id="email" placeholder="Email" />
		</div>
	`,
})
export class InputLabelPreview {}
