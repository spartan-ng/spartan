import { computed, contentChild, Directive, input } from '@angular/core';
import { BrnAutocompleteLabel } from './brn-autocomplete-label';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocompleteList]',
	host: {
		role: 'listbox',
		tabIndex: '-1',
		'aria-orientation': 'vertical',
		'[id]': 'id()',
		'[attr.data-empty]': '!_visibleItems() ? "" : null',
		'[attr.aria-label]': 'ariaLabel()',
		'[attr.aria-labelledby]': '_ariaLabelledBy()',
	},
})
export class BrnAutocompleteList {
	private static _id = 0;

	private readonly _autocomplete = injectBrnAutocompleteBase();

	/** Determine if the autocomplete has any visible items */
	protected readonly _visibleItems = this._autocomplete.visibleItems;

	/** The id of the autocomplete list */
	public readonly id = input<string>(`brn-autocomplete-list-${++BrnAutocompleteList._id}`);

	/** Optional accessible name for the listbox. Usually not needed as the autocomplete names the widget. */
	public readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
	/** Optional id of the element that labels the listbox. */
	public readonly ariaLabelledby = input<string | undefined>(undefined, { alias: 'aria-labelledby' });

	private readonly _label = contentChild(BrnAutocompleteLabel, { descendants: false });

	protected readonly _ariaLabelledBy = computed(
		() => this.ariaLabelledby() ?? (this.ariaLabel() ? undefined : this._label()?.id()),
	);

	constructor() {
		this._autocomplete.registerAutocompleteList(this);
	}
}
