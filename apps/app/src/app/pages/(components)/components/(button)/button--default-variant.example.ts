import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-default',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn>Button</button>
	`,
})
export class ButtonDefault {}
