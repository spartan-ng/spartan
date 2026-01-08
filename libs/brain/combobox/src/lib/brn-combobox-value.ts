import { computed, Directive } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { injectBrnCombobox } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxValue]',
	host: {
		'[textContent]': '_value()',
	},
})
export class BrnComboboxValue<T> {
	private readonly _combobox = injectBrnCombobox<T>();

	protected readonly _value = computed(() => stringifyAsLabel(this._combobox.value(), this._combobox.itemToString()));
}
