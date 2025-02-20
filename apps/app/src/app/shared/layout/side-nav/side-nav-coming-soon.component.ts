import { Component } from '@angular/core';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';

@Component({
	selector: 'spartan-side-nav-cs',
	imports: [HlmBadgeDirective],
	host: {
		class: 'inline-block',
	},
	template: `
		<span class="text-primary-foreground bg-primary rounded-lg px-1 py-0.5 text-[0.5rem] font-medium">soon</span>
	`,
})
export class SideNavComponent {}
