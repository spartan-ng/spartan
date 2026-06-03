import { computed, Directive, ElementRef, inject } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	host: {
		'[attr.data-empty]': '_isEmpty() ? "" : null',
		'[style.--brn-combobox-width.px]': '_comboboxWidth()',
	},
})
export class BrnComboboxContent {
	private readonly _combobox = injectBrnComboboxBase();
	public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

	/** Determine if the combobox has no visible items */
	protected readonly _isEmpty = computed(() => !this._combobox.visibleItems());

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;
}
