import { Directive, input } from '@angular/core';
import { injectBrnCombobox } from './brn-combobox.token';

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

	private readonly _combobox = injectBrnCombobox();

	/** Determine if the command has any visible items */
	protected readonly _visibleItems = this._combobox.visibleItems;

	/** The id of the command list */
	public readonly id = input<string>(`brn-combobox-list-${++BrnComboboxList._id}`);
}
