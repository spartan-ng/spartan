import { Directive } from '@angular/core';
import { injectBrnCombobox } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	host: {
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
		'[style.--brn-combobox-width.px]': '_comboboxWidth()',
	},
})
export class BrnComboboxContent {
	private readonly _combobox = injectBrnCombobox();

	/** Determine if the command has any visible items */
	protected readonly _visibleItems = this._combobox.visibleItems;

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;
}
