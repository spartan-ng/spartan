import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-outline',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn variant="outline">Outline</button>
	`,
})
export class ButtonOutline {}
