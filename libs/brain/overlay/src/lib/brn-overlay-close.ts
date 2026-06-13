import { Directive, inject } from '@angular/core';
import { BrnOverlayRef } from './brn-overlay-ref';

@Directive({
	selector: 'button[brnOverlayClose]',
	host: {
		'(click)': 'close()',
	},
})
export class BrnOverlayClose {
	private readonly _brnOverlayRef = inject(BrnOverlayRef);

	public close(): void {
		this._brnOverlayRef.close();
	}
}
