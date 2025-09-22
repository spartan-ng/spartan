import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-destructive',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn variant="destructive">Destructive</button>
	`,
})
export class ButtonDestructive {}
