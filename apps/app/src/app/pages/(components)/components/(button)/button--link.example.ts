import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-link',
	imports: [HlmButton],
	template: `
		<button hlmBtn variant="link">Link</button>
	`,
})
export class ButtonLink {}
