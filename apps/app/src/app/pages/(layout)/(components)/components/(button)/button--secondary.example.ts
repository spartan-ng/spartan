import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-secondary',
	imports: [HlmButton],
	template: `
		<button hlmBtn variant="secondary">Secondary</button>
	`,
})
export class ButtonSecondary {}
