import { Component } from '@angular/core';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-disabled',
	imports: [HlmInput],
	template: `
		<input class="w-80" hlmInput disabled type="email" placeholder="Email" />
	`,
})
export class InputDisabledPreview {}
