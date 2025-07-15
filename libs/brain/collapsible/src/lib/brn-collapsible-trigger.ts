import { Directive, inject } from '@angular/core';
import { BrnCollapsible } from './brn-collapsible';

@Directive({
	selector: 'button[brnCollapsibleTrigger]',
	host: {
		'[attr.data-state]': 'collapsible?.expanded() ? "open" : "closed"',
		'[attr.disabled]': 'collapsible?.disabled() ? true : undefined',
		'[attr.aria-expanded]': 'collapsible?.expanded()',
		'[attr.aria-controls]': 'collapsible?.contentId()',
		'(click)': 'toggle()',
	},
})
export class BrnCollapsibleTrigger {
	protected readonly collapsible = inject(BrnCollapsible, { optional: true });

	constructor() {
		if (!this.collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	toggle(): void {
		this.collapsible?.toggle();
	}
}
