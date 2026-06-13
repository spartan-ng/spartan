import { Directive, effect, ElementRef, inject } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({ selector: '[brnAutocompleteAnchor]' })
export class BrnAutocompleteAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	private readonly _autocomplete = injectBrnAutocompleteBase();
	private readonly _elementSize = injectElementSize();

	constructor() {
		effect(() => {
			const size = this._elementSize();
			if (size) {
					this._autocomplete.updateInputWidth(size.width);
					this._brnOverlay?.updatePosition();
				}
			});

			this._brnOverlay?.setOrigin(this._host.nativeElement);
		}
	}
