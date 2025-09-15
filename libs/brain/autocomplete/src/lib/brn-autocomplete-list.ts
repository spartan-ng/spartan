import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
	},
})
export class BrnAutocompleteList {
	private static _id = 0;

	/** The id of the command list */
	public readonly id = input<string>(`brn-autocomplete-list-${++BrnAutocompleteList._id}`);
}
