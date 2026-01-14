import { Directive } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	host: {
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
		'[style.--brn-combobox-width.px]': '_comboboxWidth()',
	},
})
export class BrnComboboxContent {
	private readonly _combobox = injectBrnComboboxBase();

	/** Determine if the combobox has any visible items */
	protected readonly _visibleItems = this._combobox.visibleItems;

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;
}
