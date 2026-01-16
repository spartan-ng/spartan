import { Directive } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: 'button[brnComboboxTrigger]',
	host: {
		type: 'button',
		'[attr.aria-disabled]': '_disabled() ? "true" : null',
		'[attr.disabled]': '_disabled() ? "" : null',
	},
})
export class BrnComboboxTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _disabled = this._combobox.disabledState;
}
