import { Directive, inject, OnDestroy } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogDescription]',
	host: {
		'[id]': '_id',
	},
})
export class BrnDialogDescription implements OnDestroy {
	private static _idGenerator = 0;

	private readonly _brnDialogRef = inject(BrnDialogRef);
	protected readonly _id = `brn-dialog-description-${this._brnDialogRef.dialogId}-${++BrnDialogDescription._idGenerator}`;

	constructor() {
		this._brnDialogRef.registerDescription(this._id);
	}

	public ngOnDestroy(): void {
		this._brnDialogRef.unregisterDescription(this._id);
	}
}
