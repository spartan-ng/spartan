import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-link',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn variant="link">Link</button>
	`,
})
export class ButtonLink {}
