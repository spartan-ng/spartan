import { Directive, input } from '@angular/core';
import { injectBrnConfirmation } from './brn-confirmation.token';

@Directive({
	selector: 'button[brnConfirmationReject],[brnConfirmationReject]',
	exportAs: 'brnConfirmationReject',
	host: {
		type: 'button',
		'data-slot': 'confirmation-reject',
		'(click)': 'onClick()',
	},
})
export class BrnConfirmationReject {
	private readonly _parent = injectBrnConfirmation({ optional: true });

	/** Optional reason emitted on reject. */
	public readonly reason = input<string | undefined>(undefined);

	protected onClick(): void {
		this._parent?.requestReject(this.reason());
	}
}
