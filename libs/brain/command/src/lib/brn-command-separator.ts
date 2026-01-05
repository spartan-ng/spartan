import { computed, Directive } from '@angular/core';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	selector: '[brnCommandSeparator]',
	host: {
		role: 'separator',
		'[attr.data-hidden]': '!_visible() ? "" : null',
	},
})
export class BrnCommandSeparator {
	private readonly _command = injectBrnCommand();

	/** Determine if the command has any visible items */
	protected readonly _visible = computed(() => this._command.items().some((item) => item.visible()));
}
