import { computed, Directive, ElementRef, inject } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	host: {
		'[attr.data-empty]': '_empty() ? "" : null',
		'[style.--brn-combobox-width.px]': '_comboboxWidth()',
	},
})
export class BrnComboboxContent {
	private readonly _combobox = injectBrnComboboxBase();
	public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Determine if the combobox is empty */
	protected readonly _empty = computed(() => !this._combobox.visibleItems() && this._combobox.search().length > 0);

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;
}
