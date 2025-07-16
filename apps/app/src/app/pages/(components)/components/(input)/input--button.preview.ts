import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-button',
	imports: [HlmInput, HlmButton],
	template: `
		<div class="flex w-full max-w-sm items-center space-x-2">
			<input aria-label="Email" class="w-80" hlmInput type="email" placeholder="Email" />
			<button hlmBtn variant="outline">Subscribe</button>
		</div>
	`,
})
export class InputButtonPreview {}
