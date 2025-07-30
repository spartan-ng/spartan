import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-destructive',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="destructive">Destructive</button>
	`,
})
export class ButtonDestructiveComponent {}
