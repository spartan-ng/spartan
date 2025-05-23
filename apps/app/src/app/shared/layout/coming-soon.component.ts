import { Component } from '@angular/core';
import { hlmMuted } from '@spartan-ng/ui-typography-helm';

@Component({
	selector: 'spartan-coming-soon',
	host: {
		class: 'justify-center relative flex-1 flex items-center mb-8',
	},
	template: `
		<p class="${hlmMuted} -mt-[10%]">Coming soon...</p>
	`,
})
export class ComingSoonComponent {}
