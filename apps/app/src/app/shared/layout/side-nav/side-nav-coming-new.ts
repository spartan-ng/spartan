import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'spartan-side-nav-new',
	host: {
		class: 'inline-block',
	},
	template: `
		<span class="rounded-lg bg-[#DD0031] px-1 py-0.5 text-[0.5rem] font-medium text-white">new</span>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavNew {}
