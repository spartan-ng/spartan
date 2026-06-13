import { computed, Directive, ElementRef, inject } from '@angular/core';
import { provideExposedSideProviderExisting } from '@spartan-ng/brain/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	providers: [provideExposedSideProviderExisting(() => BrnComboboxContent)],
	host: {
		'[attr.data-empty]': '_isEmpty() ? "" : null',
		'[style.--brn-combobox-width.px]': '_comboboxWidth()',
	},
})
export class BrnComboboxContent {
	private readonly _combobox = injectBrnComboboxBase();
	public readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _dialog = inject(BrnDialog, { optional: true });
	// The side the overlay was placed on (CDK-resolved), for the directional enter animation.
	public readonly side = computed(() => this._dialog?.resolvedSide() ?? 'bottom');

	/** Determine if the combobox has no visible items */
	protected readonly _isEmpty = computed(() => !this._combobox.visibleItems());

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;
}
