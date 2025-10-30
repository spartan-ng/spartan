import { Directive, input } from '@angular/core';
import { injectBrnCollapsible } from './brn-collapsible-token';

@Directive({
	selector: 'button[brnCollapsibleTrigger]',
	host: {
		'[attr.data-state]': '_collapsible?.state()',
		'[attr.disabled]': '_collapsible?.disabled() ? true : undefined',
		'[attr.aria-expanded]': '_collapsible?.expanded()',
		'[attr.aria-controls]': '_collapsible?.contentId()',
		'[type]': 'type()',
		'(click)': 'toggle()',
	},
})
export class BrnCollapsibleTrigger {
	protected readonly _collapsible = injectBrnCollapsible();

	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	constructor() {
		if (!this._collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	toggle(): void {
		this._collapsible?.toggle();
	}
}
