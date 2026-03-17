import { computed, Directive, input } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectValue]',
	host: {
		'[attr.data-placeholder]': '_isPlaceholder() ? "" : null',
		'[attr.data-hidden]': '_hidden() ? "" : null',
		'[textContent]': '_value()',
	},
})
export class BrnSelectValue<T> {
	private readonly _select = injectBrnSelectBase<T>();

	public readonly placeholder = input<string>('');

	protected readonly _isPlaceholder = computed(() => !this._select.hasValue());

	public readonly hidden = computed(() => !this._select.hasValue() && !this.placeholder());

	protected readonly _value = computed(() => {
		const value = this._select.value();
		return value ? stringifyAsLabel(value, this._select.itemToString()) : this.placeholder();
	});
}
