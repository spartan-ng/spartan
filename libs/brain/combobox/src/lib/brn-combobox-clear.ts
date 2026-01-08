import { computed, Directive, effect, inject, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnCombobox } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxClear]',
})
export class BrnComboboxClear {
	private readonly _combobox = injectBrnCombobox();
	private readonly _renderer = inject(Renderer2);
	private readonly _templateRef = inject<TemplateRef<void>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	/** Determine if the combobox has a value */
	private readonly _hasValue = computed(() => this._combobox.value() !== null);

	constructor() {
		effect(() => {
			this._viewContainerRef.clear();
			if (this._hasValue()) {
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

	clear() {
		this._combobox.resetValue();
	}
}
