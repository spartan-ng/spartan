import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteGroup]',
	host: {
		role: 'group',
		'[id]': 'id()',
	},
})
export class BrnAutocompleteGroup {
	private static _id = 0;

	/** The id of the autocomplete list */
	public readonly id = input<string>(`brn-autocomplete-group-${++BrnAutocompleteGroup._id}`);
}
