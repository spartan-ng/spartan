import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-ghost',
	imports: [HlmButton],
	template: `
		<button hlmBtn variant="ghost">Ghost</button>
	`,
})
export class ButtonGhost {}
