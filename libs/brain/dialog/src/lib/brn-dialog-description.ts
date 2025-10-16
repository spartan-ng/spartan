import { Directive, effect, inject, signal } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogDescription]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnDialogDescription {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	protected readonly _id = signal(`brn-dialog-description-${this._brnDialogRef?.dialogId}`);

	constructor() {
		effect(() => {
			this._brnDialogRef.setAriaDescribedBy(this._id());
		});
	}
}
