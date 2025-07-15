import { BooleanInput } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Directive, booleanAttribute, computed, inject, input, model } from '@angular/core';

@Directive({
	selector: 'button[hlmToggle], button[brnToggle]',
	host: {
		'[id]': 'id()',
		'[attr.disabled]': 'disabled() ? true : null',
		'[attr.data-disabled]': 'disabled() ? true : null',
		'[attr.data-state]': '_state()',
		'[attr.aria-pressed]': 'isOn()',
		'(click)': 'toggle()',
	},
})
export class BrnToggle<T> {
	private static _uniqueId = 0;

	private readonly _changeDetector = inject(ChangeDetectorRef);

	/** The id of the toggle. */
	public readonly id = input(`brn-toggle-${BrnToggle._uniqueId++}`);

	/** The value this toggle represents. */
	public readonly value = input<T>();

	/** Whether the toggle is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** The current state of the toggle when not used in a group. */
	public readonly state = model<'on' | 'off'>('off');

	/** Whether the toggle is responds to click events. */
	public readonly disableToggleClick = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the toggle is in the on state. */
	protected readonly isOn = computed(() => this._state() === 'on');

	/** The current state that reflects the group state or the model state. */
	protected readonly _state = computed(() => {
		return this.state();
	});

	toggle(): void {
		if (this.disableToggleClick()) return;

		this.state.set(this.isOn() ? 'off' : 'on');
	}
}
