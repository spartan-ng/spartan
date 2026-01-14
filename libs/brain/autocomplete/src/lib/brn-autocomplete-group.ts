import { computed, contentChild, contentChildren, Directive } from '@angular/core';
import { BrnAutocompleteItemToken } from './brn-autocomplete-item.token';
import { BrnAutocompleteLabel } from './brn-autocomplete-label';

@Directive({
	selector: '[brnAutocompleteGroup]',
	host: {
		role: 'group',
		'[attr.data-hidden]': '!_visible() ? "" : null',
		'[attr.aria-labelledby]': '_labelledBy()',
	},
})
export class BrnAutocompleteGroup {
	/** Get the items in the group */
	private readonly _items = contentChildren(BrnAutocompleteItemToken, {
		descendants: true,
	});

	/** Determine if there are any visible items in the group */
	protected readonly _visible = computed(() => this._items().length > 0);

	/** Get the label associated with the group */
	private readonly _label = contentChild(BrnAutocompleteLabel);

	protected readonly _labelledBy = computed(() => {
		const label = this._label();
		return label ? label.id() : null;
	});
}
