import { Directive, inject } from '@angular/core';
import { BrnCollapsibleComponent } from './brn-collapsible.component';

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
export class BrnCollapsibleTriggerDirective {
	protected readonly collapsible = inject(BrnCollapsibleComponent, { optional: true });

	constructor() {
		if (!this.collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}
	}

	toggle(): void {
		this.collapsible?.toggle();
	}
}
