import { Directive } from '@angular/core';
import { injectBrnConfirmation } from './brn-confirmation.token';

@Directive({
	selector: 'button[brnConfirmationApprove],[brnConfirmationApprove]',
	exportAs: 'brnConfirmationApprove',
	host: {
		type: 'button',
		'data-slot': 'confirmation-approve',
		'(click)': 'onClick()',
	},
})
export class BrnConfirmationApprove {
	private readonly _parent = injectBrnConfirmation({ optional: true });

	protected onClick(): void {
		this._parent?.requestApprove();
	}
}
