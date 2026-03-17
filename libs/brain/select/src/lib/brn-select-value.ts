import { computed, Directive } from '@angular/core';
import { stringifyAsLabel } from '@spartan-ng/brain/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectValue]',
	host: {
		'[textContent]': '_value()',
	},
})
export class BrnSelectValue<T> {
	private readonly _select = injectBrnSelectBase<T>();

	protected readonly _value = computed(() => stringifyAsLabel(this._select.value(), this._select.itemToString()));
}
