import { Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-file',
	imports: [HlmInputImports],
	template: `
		<input class="w-80" hlmInput type="file" />
	`,
})
export class InputFilePreview {}
