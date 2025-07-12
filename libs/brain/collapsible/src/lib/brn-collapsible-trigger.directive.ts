import { Directive, inject } from '@angular/core';
import { BrnCollapsibleComponent } from './brn-collapsible.component';

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
export class BrnCollapsibleTriggerDirective {
	protected readonly _collapsible = inject(BrnCollapsibleComponent, { optional: true });

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	toggle(): void {
		this._collapsible?.toggle();
	}
}
