import { Directive, inject, input } from '@angular/core';
import { BrnSelectMultiple } from './brn-select-multiple';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
		'[attr.aria-multiselectable]': '_multiple ? true : null',
	},
})
export class BrnSelectList {
	private static _id = 0;

	private readonly _select = injectBrnSelectBase();

	protected readonly _multiple = inject(BrnSelectMultiple, { optional: true });

	/** The id of the select list */
	public readonly id = input<string>(`brn-select-list-${++BrnSelectList._id}`);

	constructor() {
		this._select.registerSelectList(this);
	}
}
