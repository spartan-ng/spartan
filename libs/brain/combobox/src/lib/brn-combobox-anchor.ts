import { Directive, ElementRef, inject } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';

@Directive({ selector: '[brnComboboxAnchor]' })
export class BrnComboboxAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	constructor() {
		if (!this._brnDialog) return;

		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
	}
}
