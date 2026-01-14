import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnComboboxLabel]',
	host: {
		'[id]': 'id()',
	},
})
export class BrnComboboxLabel {
	private static _id = 0;

	/** The id of the combobox label */
	public readonly id = input<string>(`brn-combobox-label-${++BrnComboboxLabel._id}`);
}
