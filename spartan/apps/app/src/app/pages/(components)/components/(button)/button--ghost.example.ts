import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-ghost',
	imports: [HlmButtonImports],
	template: `
		<button hlmBtn variant="ghost">Ghost</button>
	`,
})
export class ButtonGhost {}
