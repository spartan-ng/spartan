import { Directive } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxTrigger]',
	host: {
		'[attr.aria-disabled]': '_disabled() ? "true" : null',
		'[attr.disabled]': '_disabled() ? "" : null',
	},
})
export class BrnComboboxTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _disabled = this._combobox.disabledState;
}
