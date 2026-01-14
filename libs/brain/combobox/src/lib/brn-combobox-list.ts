import { Directive, input } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxList]',
	host: {
		role: 'listbox',
		tabIndex: '-1',
		'aria-orientation': 'vertical',
		'[id]': 'id()',
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
	},
})
export class BrnComboboxList {
	private static _id = 0;

	private readonly _combobox = injectBrnComboboxBase();

	/** Determine if the combobox has any visible items */
	protected readonly _visibleItems = this._combobox.visibleItems;

	/** The id of the combobox list */
	public readonly id = input<string>(`brn-combobox-list-${++BrnComboboxList._id}`);
}
