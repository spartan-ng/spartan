import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	host: {
		'[id]': 'id()',
		'[attr.data-state]': '_dataState()',
		'[attr.data-empty]': '_isEmpty() ? "" : null',
		'[style.--brn-combobox-width.px]': '_comboboxWidth()',
	},
})
export class BrnComboboxContent {
	private static _id = 0;

	private readonly _combobox = injectBrnComboboxBase();
	public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

	/** The id of the combobox content */
	public readonly id = input<string>(`brn-combobox-content-${++BrnComboboxContent._id}`);

	protected readonly _dataState = computed<'open' | 'closed'>(() => (this._combobox.isExpanded() ? 'open' : 'closed'));

	/** Determine if the combobox has no visible items */
	protected readonly _isEmpty = computed(() => !this._combobox.visibleItems());

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;
}
