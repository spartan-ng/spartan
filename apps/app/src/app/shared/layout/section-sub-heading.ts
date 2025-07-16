import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
	selector: 'spartan-section-sub-heading',
	host: {
		class: 'block pb-2',
		'[class.-mt-12]': '_first',
	},
	template: `
		<h2 class="font-heading border-border border-b pt-12 text-2xl font-semibold tracking-tight">
			<ng-content />
		</h2>
	`,
})
export class SectionSubHeading {
	protected _first = false;
	@Input({ transform: booleanAttribute })
	public set first(value: boolean) {
		this._first = value;
	}
}
