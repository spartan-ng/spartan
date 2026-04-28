import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({ selector: '[brnComboboxInputWrapper]' })
export class BrnComboboxInputWrapper {
	private readonly _elementRef = inject(ElementRef<HTMLElement>);
	private readonly _destroyRef = inject(DestroyRef);

	private readonly _combobox = injectBrnComboboxBase();

	constructor() {
		afterNextRender(() => {
			const element = this._elementRef.nativeElement;
			this.updateInputWidth(element);

			const observer = new ResizeObserver(() => this.updateInputWidth(element));

			observer.observe(element);

			this._destroyRef.onDestroy(() => observer.disconnect());
		});
	}

	private updateInputWidth(element: HTMLElement) {
		this._combobox.updateInputWidth(element.getBoundingClientRect().width || element.offsetWidth);
	}
}
