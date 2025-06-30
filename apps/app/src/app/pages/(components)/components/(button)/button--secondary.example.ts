import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-secondary',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="secondary">Secondary</button>
	`,
})
export class ButtonSecondaryComponent {}
