import { Directive, inject } from '@angular/core';
import { BrnComboboxChip } from './brn-combobox-chip';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: 'button[brnComboboxChipRemove]',
	host: {
		type: 'button',
		tabindex: '-1',
		'aria-disabled': 'true',
		'[attr.data-disabled]': '_disabled() ? "" : null',
		'[attr.aria-disabled]': '_disabled() ? "true" : null',
		'[attr.disabled]': '_disabled() ? "" : null',
		'(click)': 'removeChip($event)',
	},
})
export class BrnComboboxChipRemove<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	private readonly _chip = inject(BrnComboboxChip<T>);

	protected readonly _disabled = this._combobox.disabledState;

	protected removeChip(event: Event) {
		event.stopPropagation();

		if (this._combobox.disabledState()) {
			return;
		}

		const value = this._chip.value();
		this._combobox.removeValue(value);
	}
}
