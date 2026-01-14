import { Directive, input } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxChip]',
	host: {
		tabindex: '-1',
		'[attr.data-disabled]': '_disabled() ? "" : null',
		'[attr.aria-disabled]': '_disabled() ? "true" : null',
	},
})
export class BrnComboboxChip<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _disabled = this._combobox.disabledState;

	public readonly value = input.required<T>();
}
