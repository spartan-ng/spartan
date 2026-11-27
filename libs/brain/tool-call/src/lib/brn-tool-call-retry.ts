import { Directive } from '@angular/core';
import { injectBrnToolCall } from './brn-tool-call.token';

@Directive({
	selector: 'button[brnToolCallRetry],[brnToolCallRetry]',
	exportAs: 'brnToolCallRetry',
	host: {
		type: 'button',
		'data-slot': 'tool-call-retry',
		'(click)': 'onClick()',
	},
})
export class BrnToolCallRetry {
	private readonly _parent = injectBrnToolCall({ optional: true });

	protected onClick(): void {
		this._parent?.requestRetry();
	}
}
