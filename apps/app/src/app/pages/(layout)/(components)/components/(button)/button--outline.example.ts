import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-outline',
	imports: [HlmButton],
	template: `
		<button hlmBtn variant="outline">Outline</button>
	`,
})
export class ButtonOutline {}
