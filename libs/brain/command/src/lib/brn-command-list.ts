import { Directive, input } from '@angular/core';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: '[brnCommandList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
	},
})
export class BrnCommandList {
	private static _id = 0;

	private readonly _command = injectBrnCommand();

	/** The id of the command list */
	public readonly id = input<string>(`brn-command-list-${++BrnCommandList._id}`);

	constructor() {
		// Register the list with the command so the input can reference its id via aria-controls.
		this._command.registerCommandList(this);
	}
}
