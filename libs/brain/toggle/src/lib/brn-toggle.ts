import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input, model } from '@angular/core';

@Directive({
	selector: 'button[brnToggle]',
	host: {
		'[id]': 'id()',
		'[attr.disabled]': 'disabled() ? true : null',
		'[attr.data-disabled]': 'disabled() ? true : null',
		'[attr.data-state]': 'state()',
		'[attr.aria-pressed]': '_isOn()',
		'[attr.aria-label]': 'ariaLabel() || null',
		'[type]': 'type()',
		'(click)': 'toggle()',
	},
})
export class BrnToggle<T> {
	private static _uniqueId = 0;

	/** The id of the toggle. */
	public readonly id = input<string>(`brn-toggle-${++BrnToggle._uniqueId}`);

	/** The value this toggle represents. */
	public readonly value = input<T>();

	/** Whether the toggle is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The current state of the toggle when not used in a group. */
	public readonly state = model<'on' | 'off'>('off');

	/** The type of the button. */
	public readonly type = input<'button' | 'submit' | 'reset'>('button');

	/**
	 * Accessibility label for screen readers.
	 * Use when no visible label exists.
	 */
	public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

	/** Whether the toggle is in the on state. */
	protected readonly _isOn = computed(() => this.state() === 'on');

	toggle(): void {
		if (this.disabled()) return;

		this.state.set(this._isOn() ? 'off' : 'on');
	}
}
