import { Directive, input } from '@angular/core';

@Directive({
	selector: '[brnCommandList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
	},
})
export class BrnCommandList {
	private static _id = 0;

	/** The id of the command list */
	public readonly id = input<string>(`brn-command-list-${++BrnCommandList._id}`);
}
