import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-input-file',
	imports: [HlmInputImports, HlmLabelImports],
	template: `
		<div class="grid w-full max-w-sm items-center gap-3">
			<label hlmLabel for="picture">Upload file</label>
			<input hlmInput id="picture" type="file" />
		</div>
	`,
})
export class InputFilePreview {}
