import { computed, Directive, effect, inject, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnAutocompleteBase } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocompleteClear]',
})
export class BrnAutocompleteClear {
	private readonly _autocomplete = injectBrnAutocompleteBase();
	private readonly _renderer = inject(Renderer2);
	private readonly _templateRef = inject<TemplateRef<void>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	/** Determine if the autocomplete has a value or search text */
	private readonly _shouldShowClear = computed(() => {
		const value = this._autocomplete.value();
		return (value !== null && value !== undefined) || this._autocomplete.search() !== '';
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

	clear() {
		this._autocomplete.resetValue();
	}
}
