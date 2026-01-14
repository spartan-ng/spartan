import { computed, contentChild, contentChildren, Directive } from '@angular/core';
import { BrnComboboxItemToken } from './brn-combobox-item.token';
import { BrnComboboxLabel } from './brn-combobox-label';

@Directive({
	selector: '[brnComboboxGroup]',
	host: {
		role: 'group',
		'[attr.data-hidden]': '!_visible() ? "" : null',
		'[attr.aria-labelledby]': '_labelledBy()',
	},
})
export class BrnComboboxGroup {
	/** Get the items in the group */
	private readonly _items = contentChildren(BrnComboboxItemToken, {
		descendants: true,
	});

	/** Determine if there are any visible items in the group */
	protected readonly _visible = computed(() => this._items().some((item) => item.visible()));

	/** Get the label associated with the group */
	private readonly _label = contentChild(BrnComboboxLabel);

	protected readonly _labelledBy = computed(() => {
		const label = this._label();
		return label ? label.id() : null;
	});
}
