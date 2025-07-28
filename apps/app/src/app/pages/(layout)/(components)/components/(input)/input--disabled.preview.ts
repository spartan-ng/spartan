import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-disabled',
	imports: [HlmInputDirective],
	template: `
		<input class="w-80" hlmInput disabled type="email" placeholder="Email" />
	`,
})
export class InputDisabledPreviewComponent {}
