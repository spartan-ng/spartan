import { computed, Directive } from '@angular/core';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: '[brnCommandSeparator]',
	host: {
		role: 'separator',
		'[attr.data-hidden]': '_hasSearchInput() ? true : null',
	},
})
export class BrnCommandSeparator {
	private readonly _command = injectBrnCommand();

	/** Determine if the command has any search input */
	protected readonly _hasSearchInput = computed(() => this._command.search().length > 0);
}
