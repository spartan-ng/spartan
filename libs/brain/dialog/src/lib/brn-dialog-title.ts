import { Directive, inject } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogTitle]',
	host: {
		'[id]': 'id',
	},
})
export class BrnDialogTitle {
	private readonly _brnDialogRef = inject(BrnDialogRef);
	protected readonly id = `brn-dialog-title-${this._brnDialogRef.dialogId}`;
}
