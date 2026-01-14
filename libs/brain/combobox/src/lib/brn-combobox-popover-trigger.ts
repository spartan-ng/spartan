import { Directive, inject } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxPopoverTrigger]',
	host: {
		'(click)': 'open()',
	},
})
export class BrnComboboxPopoverTrigger<T> {
	private readonly _combobox = injectBrnComboboxBase<T>();

	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	open() {
		if (this._combobox.disabledState()) return;

		this._brnDialog?.open();
	}
}
