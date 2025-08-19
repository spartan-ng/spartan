import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-anchor',
	imports: [HlmButton],
	template: `
		<a hlmBtn target="_blank" variant="link" href="https://github.com/goetzrobin/spartan">Star on GitHub</a>
	`,
})
export class ButtonAnchor {}
