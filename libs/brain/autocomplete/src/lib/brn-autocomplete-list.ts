import { Directive, input } from '@angular/core';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocompleteList]',
	host: {
		role: 'listbox',
		tabIndex: '-1',
		'aria-orientation': 'vertical',
		'[id]': 'id()',
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
	},
})
export class BrnAutocompleteList {
	private static _id = 0;

	private readonly _autocomplete = injectBrnAutocompleteBase();

	/** Determine if the autocomplete has any visible items */
	protected readonly _visibleItems = this._autocomplete.visibleItems;

	/** The id of the autocomplete list */
	public readonly id = input<string>(`brn-autocomplete-list-${++BrnAutocompleteList._id}`);
}
