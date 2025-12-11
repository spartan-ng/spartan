import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-anchor',
	imports: [HlmButtonImports],
	template: `
		<a hlmBtn target="_blank" variant="link" href="https://github.com/spartan-ng/spartan">Star on GitHub</a>
	`,
})
export class ButtonAnchor {}
