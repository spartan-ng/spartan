import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, inject, input, linkedSignal } from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxPopoverTrigger]',
	host: {
		'(click)': '_onClick()',
	},
})
export class BrnComboboxPopoverTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	/**
	 * Whether clicking the trigger may close an open popover. Button triggers toggle (click again to
	 * close); text-input triggers set this to `false` so clicking or typing in an open combobox only
	 * ever opens it and never closes it underneath the user.
	 */
	public readonly closeOnTriggerClickInput = input<boolean, BooleanInput>(true, {
		alias: 'closeOnTriggerClick',
		transform: booleanAttribute,
	});

	/** Writable, input-synced state so the behavior can also be set programmatically. */
	public readonly closeOnTriggerClick = linkedSignal(this.closeOnTriggerClickInput);

	protected _onClick() {
		if (this._combobox.disabledState()) return;

		if (this.closeOnTriggerClick()) {
			this._brnOverlay?.toggle();
		} else {
			this._brnOverlay?.open();
		}
	}
}
