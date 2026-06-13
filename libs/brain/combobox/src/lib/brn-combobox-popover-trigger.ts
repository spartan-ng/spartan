import { Directive, inject } from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxPopoverTrigger]',
	host: {
		'(click)': 'open()',
	},
})
export class BrnComboboxPopoverTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	private readonly _brnOverlay = inject(BrnOverlay, { optional: true });

	protected open() {
		if (this._combobox.disabledState()) return;

		this._brnOverlay?.open();
	}
}
