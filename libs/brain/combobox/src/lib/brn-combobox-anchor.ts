import { Directive, ElementRef, inject } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { BrnComboboxContent } from './brn-combobox-content';

@Directive({ selector: '[brnComboboxAnchor]' })
export class BrnComboboxAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	private readonly _content = inject(BrnComboboxContent, { optional: true });

	constructor() {
		// skip if it's inside a combobox content
		if (this._content) return;

		if (!this._brnDialog) return;

		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
	}
}
