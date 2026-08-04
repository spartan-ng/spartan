import { Directive, input } from '@angular/core';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: '[brnCommandList]',
	host: {
		role: 'listbox',
		'[id]': 'id()',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class BrnCommandList {
	private static _id = 0;

	private readonly _command = injectBrnCommand();

	/** The id of the command list */
	public readonly id = input<string>(`brn-command-list-${++BrnCommandList._id}`);

	/** Optional accessible name for the listbox. Usually not needed as the combobox names the widget. */
	public readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

	constructor() {
		this._command.registerCommandList(this);
	}
}
