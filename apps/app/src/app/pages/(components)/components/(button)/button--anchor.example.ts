import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-anchor',
	imports: [HlmButtonDirective],
	template: `
		<a hlmBtn target="_blank" variant="link" href="https://github.com/goetzrobin/spartan">Star on GitHub</a>
	`,
})
export class ButtonAnchorComponent {}
