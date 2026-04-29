import { Directive, effect, ElementRef, inject } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({ selector: '[brnAutocompleteAnchor]' })
export class BrnAutocompleteAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	private readonly _autocomplete = injectBrnAutocompleteBase();
	private readonly _elementSize = injectElementSize();

	constructor() {
		effect(() => {
			const size = this._elementSize();
			if (size) {
				this._autocomplete.updateInputWidth(size.width);
				this._brnDialog?.updatePosition();
			}
		});

		if (!this._brnDialog) return;

		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
	}
}
