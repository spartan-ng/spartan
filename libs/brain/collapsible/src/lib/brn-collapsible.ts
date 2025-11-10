import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input, model, numberAttribute, signal } from '@angular/core';
import { injectBrnCollapsibleConfig, provideBrnCollapsible } from './brn-collapsible-token';

let collapsibleContentIdSequence = 0;

export type BrnCollapsibleState = 'open' | 'closed';

@Directive({
	selector: '[brnCollapsible],brn-collapsible',
	host: {
		'[attr.data-state]': 'state()',
		'[attr.disabled]': 'disabled() ? true : undefined',
	},
	providers: [provideBrnCollapsible(BrnCollapsible)],
})
export class BrnCollapsible {
	private readonly _config = injectBrnCollapsibleConfig();

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

	/** The delay in milliseconds before showing the collapsible component. */
	public readonly showDelay = input<number, NumberInput>(this._config.showDelay, { transform: numberAttribute });

	/** The delay in milliseconds before hiding the collapsible component. */
	public readonly hideDelay = input<number, NumberInput>(this._config.hideDelay, { transform: numberAttribute });

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
