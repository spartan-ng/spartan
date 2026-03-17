import { Directive } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectPlaceholder]',
	host: {
		'[attr.data-hidden]': '_value() ? "" : null',
	},
})
export class BrnSelectPlaceholder {
	private readonly _select = injectBrnSelectBase();

	protected readonly _value = this._select.value;
}
