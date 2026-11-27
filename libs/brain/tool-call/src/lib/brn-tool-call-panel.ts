import { DestroyRef, Directive, inject } from '@angular/core';
import { injectBrnToolCall } from './brn-tool-call.token';

let toolCallPanelIdSequence = 0;

@Directive({
	selector: '[brnToolCallPanel]',
	exportAs: 'brnToolCallPanel',
	host: {
		'data-slot': 'tool-call-panel',
		'[id]': 'id',
	},
})
export class BrnToolCallPanel {
	private readonly _parent = injectBrnToolCall({ optional: true });

	public readonly id = `brn-tool-call-panel-${++toolCallPanelIdSequence}`;

	constructor() {
		if (this._parent) {
			const parent = this._parent;
			parent.registerPanel(this.id);
			inject(DestroyRef).onDestroy(() => parent.unregisterPanel(this.id));
		}
	}
}
