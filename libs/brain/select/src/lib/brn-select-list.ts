import { Directive, input } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
	},
})
export class BrnSelectList {
	private static _id = 0;

	private readonly _select = injectBrnSelectBase();

	/** The id of the select list */
	public readonly id = input<string>(`brn-select-list-${++BrnSelectList._id}`);

	constructor() {
		this._select.registerSelectList(this);
	}
}
