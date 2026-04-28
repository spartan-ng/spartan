import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { BrnDialog } from '@spartan-ng/brain/dialog';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({ selector: '[brnAutocompleteAnchor]' })
export class BrnAutocompleteAnchor {
	private readonly _host = inject(ElementRef, { host: true });
	private readonly _brnDialog = inject(BrnDialog, { optional: true });

	private readonly _elementRef = inject(ElementRef<HTMLElement>);
	private readonly _destroyRef = inject(DestroyRef);

	private readonly _autocomplete = injectBrnAutocompleteBase();

	constructor() {
		afterNextRender(() => {
			const element = this._elementRef.nativeElement;
			this.updateInputWidth(element);

			const observer = new ResizeObserver(() => this.updateInputWidth(element));

			observer.observe(element);

			this._destroyRef.onDestroy(() => observer.disconnect());
		});

		if (!this._brnDialog) return;

		this._brnDialog.mutableAttachTo.set(this._host.nativeElement);
	}

	private updateInputWidth(element: HTMLElement) {
		this._autocomplete.updateInputWidth(element.getBoundingClientRect().width || element.offsetWidth);
	}
}
