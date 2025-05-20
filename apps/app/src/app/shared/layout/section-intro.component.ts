import { Component, Input } from '@angular/core';
import { hlmLead } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-section-intro',
	standalone: true,
	host: {
		class: 'mb-8 block space-y-2',
	},
	template: `
		<h1 class="scroll-m-20 text-4xl font-bold tracking-tight">{{ name }}</h1>
		<p class="${hlmLead}">{{ lead }}</p>
	`,
})
export class SectionIntroComponent {
	@Input()
	public name = '';
	@Input()
	public lead = '';
}
