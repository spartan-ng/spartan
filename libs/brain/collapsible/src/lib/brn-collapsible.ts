import type { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, booleanAttribute, input, model, signal } from '@angular/core';

let collapsibleContentIdSequence = 0;

export type BrnCollapsibleState = 'open' | 'closed';

@Component({
	selector: 'brn-collapsible',
	host: {
		'[attr.data-state]': 'expanded() ? "open" : "closed"',
		'[attr.disabled]': 'disabled() ? true : undefined',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnCollapsible {
	public readonly contentId = signal(`brn-collapsible-content-${++collapsibleContentIdSequence}`);

	/**
	 * The expanded or collapsed state of the collapsible component.
	 */
	public readonly expanded = model<boolean>(false);

	/**
	 * The disabled state of the collapsible component.
	 */
	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	/**
	 * Toggles the expanded state of the collapsible component.
	 */
	public toggle(): void {
		this.expanded.update((expanded) => !expanded);
	}
}
