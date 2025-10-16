import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-button',
	imports: [HlmInputImports, HlmButtonImports],
	template: `
		<div class="flex w-full max-w-sm items-center gap-2">
			<input class="w-80" hlmInput type="email" placeholder="Email" />
			<button hlmBtn variant="outline">Subscribe</button>
		</div>
	`,
})
export class InputButtonPreview {}
