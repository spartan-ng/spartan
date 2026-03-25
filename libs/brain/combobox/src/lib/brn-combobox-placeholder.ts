import { Directive } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxPlaceholder]',
	host: {
		'[attr.data-hidden]': '_hasValue() ? "" : null',
	},
})
export class BrnComboboxPlaceholder {
	private readonly _combobox = injectBrnComboboxBase();

	protected readonly _hasValue = this._combobox.hasValue;
}
