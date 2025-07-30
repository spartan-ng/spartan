import { Directive, effect, inject, signal } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogTitle]',
	host: {
		'[id]': '_id()',
	},
})
export class BrnDialogTitle {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	protected readonly _id = signal(`brn-dialog-title-${this._brnDialogRef?.dialogId}`);

	constructor() {
		effect(() => {
			this._brnDialogRef.setAriaLabelledBy(this._id());
		});
	}
}
