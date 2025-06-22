import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
	selector: 'spartan-button-ghost',
	imports: [HlmButtonDirective],
	template: `
		<button hlmBtn variant="ghost">Ghost</button>
	`,
})
export class ButtonGhostComponent {}
