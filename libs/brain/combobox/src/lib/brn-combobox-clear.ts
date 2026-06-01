import { computed, Directive, effect, inject, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxClear]',
})
export class BrnComboboxClear {
	private readonly _combobox = injectBrnComboboxBase();
	private readonly _renderer = inject(Renderer2);
	private readonly _templateRef = inject<TemplateRef<void>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	/** Determine if the combobox has a value */
	private readonly _shouldShowClear = computed(() => {
		const mode = this._combobox.mode();
		if (mode === 'combobox') {
			return this._combobox.value() !== null || this._combobox.search() !== '';
		} else {
			return this._combobox.search() !== '';
		}
	});

	constructor() {
		effect(() => {
			this._viewContainerRef.clear();
			if (this._shouldShowClear()) {
				const view = this._viewContainerRef.createEmbeddedView(this._templateRef);
				view.rootNodes.forEach((node) => {
					this._renderer.listen(node, 'click', (e) => {
						e.preventDefault();
						this.clear();
					});
				});
			}
		});
	}

	private clear() {
		if (this._combobox.mode() === 'combobox') {
			this._combobox.resetValue();
			this._combobox.resetSearch();
		} else {
			this._combobox.resetSearch();
		}
	}
}
