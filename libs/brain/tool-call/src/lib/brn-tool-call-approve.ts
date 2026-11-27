import { Directive } from '@angular/core';
import { injectBrnToolCall } from './brn-tool-call.token';

@Directive({
	selector: 'button[brnToolCallApprove],[brnToolCallApprove]',
	exportAs: 'brnToolCallApprove',
	host: {
		type: 'button',
		'data-slot': 'tool-call-approve',
		'(click)': 'onClick()',
	},
})
export class BrnToolCallApprove {
	private readonly _parent = injectBrnToolCall({ optional: true });

	protected onClick(): void {
		this._parent?.requestApprove();
	}
}
