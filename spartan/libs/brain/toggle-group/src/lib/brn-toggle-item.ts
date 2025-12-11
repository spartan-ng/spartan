import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, booleanAttribute, computed, input, model } from '@angular/core';
import { injectBrnToggleGroup } from './brn-toggle-group.token';

@Directive({
	selector: 'button[brnToggleGroupItem]',
	host: {
		'[id]': 'id()',
		'[attr.disabled]': '_disabled() ? true : null',
		'[attr.data-disabled]': '_disabled() ? true : null',
		'[attr.data-state]': '_state()',
		'[attr.aria-pressed]': '_isOn()',
		'[attr.aria-label]': 'ariaLabel() || null',
		'[type]': 'type()',
		'(click)': 'toggle()',
	},
})
export class BrnToggleGroupItem<T> {
	private static _uniqueId = 0;

	/** Access the toggle group if available. */
	protected readonly _group = injectBrnToggleGroup<T>();

	/** The id of the toggle. */
	public readonly id = input<string>(`brn-toggle-group-item-${++BrnToggleGroupItem._uniqueId}`);

	/** The value this toggle represents. */
	public readonly value = input<T>();

	/** Whether the toggle is disabled. */
	public readonly disabled = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/** Whether the toggle is disabled either from itself or from the group. */
	protected readonly _disabled = computed(() => this.disabled() || this._group?.disabled());

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
	protected readonly _isOn = computed(() => this._state() === 'on');

	/** The current state that reflects the group state or the model state. */
	protected readonly _state = computed(() => {
		if (this._group) {
			return this._group.isSelected(this.value() as T) ? 'on' : 'off';
		}
		return this.state();
	});

	toggle(): void {
		if (this._disabled()) return;

		if (this._group) {
			if (this._isOn()) {
				this._group.deselect(this.value() as T, this);
			} else {
				this._group.select(this.value() as T, this);
			}
		} else {
			this.state.set(this._isOn() ? 'off' : 'on');
		}
	}
}
