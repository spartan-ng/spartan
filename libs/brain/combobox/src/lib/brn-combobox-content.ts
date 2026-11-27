import { computed, Directive, effect, ElementRef, inject, input } from '@angular/core';
import { injectElementSize } from '@spartan-ng/brain/core';
import { BrnOverlay, BrnOverlayRef } from '@spartan-ng/brain/overlay';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxContent]',
	exportAs: 'brnComboboxContent',
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

	private readonly _elementSize = injectElementSize();
	private readonly _overlay = inject(BrnOverlay, { optional: true });
	private readonly _overlayRef = inject(BrnOverlayRef, { optional: true });

	/** The id of the combobox content */
	public readonly id = input<string>(`brn-combobox-content-${++BrnComboboxContent._id}`);

	protected readonly _dataState = computed<'open' | 'closed'>(() => (this._combobox.isExpanded() ? 'open' : 'closed'));

	/** Determine if the combobox has no visible items */
	protected readonly _isEmpty = computed(() => !this._combobox.visibleItems());

	protected readonly _comboboxWidth = this._combobox.searchInputWrapperWidth;

	constructor() {
		effect(() => {
			const size = this._elementSize();
			if (!size) return;
			if (this._combobox.isExpanded && !this._combobox.isExpanded()) return;

			this.updatePosition();
		});
	}

	public updatePosition(): void {
		if (this._overlayRef) {
			this._overlayRef.updatePosition();
		} else if (this._overlay) {
			this._overlay.updatePosition();
		} else {
			this._combobox.updatePosition?.();
		}
	}
}
