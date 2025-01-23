import { Directive, input } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnCommandList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
	},
})
export class BrnCommandListDirective {
	private static _id = 0;

	/** The id of the command list */
	public readonly id = input<string>(`brn-command-list-${BrnCommandListDirective._id++}`);
}
