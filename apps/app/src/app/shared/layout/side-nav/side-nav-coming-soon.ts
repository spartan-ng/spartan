import { Component } from '@angular/core';

@Component({
	selector: 'spartan-side-nav-cs',
	host: {
		class: 'inline-block',
	},
	template: `
		<span class="text-primary-foreground bg-primary rounded-lg px-1 py-0.5 text-[0.5rem] font-medium">soon</span>
	`,
})
export class SideNavComingSoon {}
