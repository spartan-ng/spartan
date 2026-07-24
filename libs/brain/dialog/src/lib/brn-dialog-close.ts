import { Directive, inject } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: 'button[brnDialogClose]',
	host: {
		'(click)': 'close()',
	},
})
export class BrnDialogClose {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	public close(): void {
		this._brnDialogRef.close();
	}
}
