import { Directive, input } from '@angular/core';
import { injectBrnToolCall } from './brn-tool-call.token';

@Directive({
	selector: 'button[brnToolCallReject],[brnToolCallReject]',
	exportAs: 'brnToolCallReject',
	host: {
		type: 'button',
		'data-slot': 'tool-call-reject',
		'(click)': 'onClick()',
	},
})
export class BrnToolCallReject {
	private readonly _parent = injectBrnToolCall({ optional: true });

	/** Optional reason string emitted on reject. */
	public readonly reason = input<string | undefined>(undefined);

	protected onClick(): void {
		this._parent?.requestReject(this.reason());
	}
}
