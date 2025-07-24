import { Directive, inject } from '@angular/core';
import { BrnCollapsible } from './brn-collapsible';

@Directive({
	selector: 'button[brnCollapsibleTrigger]',
	host: {
		'[attr.data-state]': '_collapsible?.expanded() ? "open" : "closed"',
		'[attr.disabled]': '_collapsible?.disabled() ? true : undefined',
		'[attr.aria-expanded]': '_collapsible?.expanded()',
		'[attr.aria-controls]': '_collapsible?.contentId()',
		'(click)': 'toggle()',
	},
})
export class BrnCollapsibleTrigger {
	protected readonly _collapsible = inject(BrnCollapsible, { optional: true });

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	toggle(): void {
		this._collapsible?.toggle();
	}
}
