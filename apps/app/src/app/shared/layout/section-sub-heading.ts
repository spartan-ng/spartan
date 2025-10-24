import { Component, booleanAttribute, input } from '@angular/core';

@Component({
	selector: 'spartan-section-sub-heading',
	host: {
		class: 'block',
		'[class.-mt-12]': 'first()',
	},
	template: `
		<h2 class="font-heading pt-12 text-xl font-medium tracking-tight lg:pt-16">
			<ng-content />
		</h2>
	`,
})
export class SectionSubHeading {
	public readonly first = input(false, { transform: booleanAttribute });
}
