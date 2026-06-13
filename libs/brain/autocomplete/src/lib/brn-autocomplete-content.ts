import { computed, Directive, inject } from '@angular/core';
import { provideExposedSideProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocompleteContent]',
	providers: [provideExposedSideProviderExisting(() => BrnAutocompleteContent)],
	host: {
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
		'[style.--brn-autocomplete-width.px]': '_autocompleteWidth()',
	},
})
export class BrnAutocompleteContent {
	private readonly _autocomplete = injectBrnAutocompleteBase();
	private readonly _dialog = inject(BrnDialog, { optional: true });
	// The side the overlay was placed on (CDK-resolved), for the directional enter animation.
	public readonly side = computed(() => this._dialog?.resolvedSide() ?? 'bottom');

	/** Determine if the autocomplete has any visible items */
	protected readonly _visibleItems = this._autocomplete.visibleItems;

	protected readonly _autocompleteWidth = this._autocomplete.searchInputWrapperWidth;
}
