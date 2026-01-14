import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnAutocompleteLabel]',
	host: {
		'[id]': 'id()',
	},
})
export class BrnAutocompleteLabel {
	private static _id = 0;

	/** The id of the autocomplete label */
	public readonly id = input<string>(`brn-autocomplete-label-${++BrnAutocompleteLabel._id}`);
}
