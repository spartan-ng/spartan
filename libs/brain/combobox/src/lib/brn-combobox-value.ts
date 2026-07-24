import { computed, Directive, input } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxValue]',
	host: {
		'[attr.data-placeholder]': '_isPlaceholder() ? "" : null',
		'[attr.data-hidden]': 'hidden() ? "" : null',
		'[textContent]': '_value()',
	},
})
export class BrnComboboxValue<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	public readonly placeholder = input<string>('');

	protected readonly _isPlaceholder = computed(() => !this._combobox.hasValue());

	public readonly hidden = computed(() => !this._combobox.hasValue() && !this.placeholder());

	protected readonly _value = computed(() => {
		return this._combobox.hasValue()
			? stringifyAsLabel(this._combobox.value(), this._combobox.itemToString())
			: this.placeholder();
	});
}
