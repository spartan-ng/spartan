import { Directive, inject } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogDescription]',
	host: {
		'[id]': 'id',
	},
})
export class BrnDialogDescription {
	private readonly _brnDialogRef = inject(BrnDialogRef);
	protected readonly id = `brn-dialog-description-${this._brnDialogRef.dialogId}`;
}
