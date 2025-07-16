import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-destructive',
	imports: [HlmButton],
	template: `
		<button hlmBtn variant="destructive">Destructive</button>
	`,
})
export class ButtonDestructive {}
