import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input, model, signal } from '@angular/core';
import { provideBrnCollapsible } from './brn-collapsible-token';

let collapsibleContentIdSequence = 0;

export type BrnCollapsibleState = 'open' | 'closed';

@Directive({
	selector: '[brnCollapsible],brn-collapsible',
	providers: [provideBrnCollapsible(BrnCollapsible)],
	host: {
		'[attr.data-state]': 'state()',
		'[attr.disabled]': 'disabled() ? true : undefined',
	},
})
export class BrnCollapsible {
	public readonly contentId = signal(`brn-collapsible-content-${++collapsibleContentIdSequence}`);

	/**
	 * The expanded or collapsed state of the collapsible component.
	 */
	public readonly expanded = model<boolean>(false);

	/**
	 * The current state of the collapsible component as 'open' or 'closed'.
	 */
	public readonly state = computed<BrnCollapsibleState>(() => (this.expanded() ? 'open' : 'closed'));

	/**
	 * The disabled state of the collapsible component.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Toggles the expanded state of the collapsible component.
	 */
	public toggle(): void {
		if (this.disabled()) {
			return;
		}

		this.expanded.update((expanded) => !expanded);
	}
}
