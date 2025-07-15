import { Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-file',
	imports: [HlmInput],
	template: `
		<input class="w-80" hlmInput type="file" />
	`,
})
export class InputFilePreview {}
