import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-secondary',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn variant="secondary">Secondary</button>
	`,
})
export class ButtonSecondary {}
