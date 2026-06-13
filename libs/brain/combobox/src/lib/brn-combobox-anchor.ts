import { Directive, effect, ElementRef, inject } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { BrnComboboxContent } from './brn-combobox-content';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({ selector: '[brnComboboxAnchor]' })
export class BrnComboboxAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	private readonly _content = inject(BrnComboboxContent, { optional: true });

	private readonly _combobox = injectBrnComboboxBase();

	private readonly _elementSize = injectElementSize();

	constructor() {
		// skip if it's inside a combobox content
		if (this._content) return;

		effect(() => {
			const size = this._elementSize();
			if (size) {
				this._combobox.updateInputWidth(size.width);
				this._brnOverlay?.updatePosition();
			}
		});

		if (!this._brnOverlay) return;

		this._brnOverlay.mutableAttachTo.set(this._host.nativeElement);
	}
}
