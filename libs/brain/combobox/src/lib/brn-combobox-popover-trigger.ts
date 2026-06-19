import { Directive, ElementRef, inject } from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxPopoverTrigger]',
	host: {
		'(click)': '_onClick()',
	},
})
export class BrnComboboxPopoverTrigger<T> {
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _combobox = injectBrnComboboxBase<T>();
	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	protected _onClick() {
		if (this._combobox.disabledState()) return;

		if (this._elementRef.nativeElement.tagName === 'BUTTON') {
			this._brnOverlay?.toggle();
		} else {
			this._brnOverlay?.open();
		}
	}
}
