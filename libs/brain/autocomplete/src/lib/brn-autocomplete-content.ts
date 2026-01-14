import { Directive } from '@angular/core';
import { injectBrnAutocomplete } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocompleteContent]',
	host: {
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
		'[style.--brn-autocomplete-width.px]': '_autocompleteWidth()',
	},
})
export class BrnAutocompleteContent {
	private readonly _autocomplete = injectBrnAutocomplete();

	/** Determine if the autocomplete has any visible items */
	protected readonly _visibleItems = this._autocomplete.visibleItems;

	protected readonly _autocompleteWidth = this._autocomplete.searchInputWrapperWidth;
}
