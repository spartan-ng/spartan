import { computed, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnAutocomplete } from './brn-autocomplete.token';

@Directive({
	selector: '[brnAutocompleteEmpty]',
})
export class BrnAutocompleteEmpty {
	private readonly _templateRef = inject<TemplateRef<void>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _autocomplete = injectBrnAutocomplete();

	/** Determine if the autocomplete has any items */
	private readonly _visible = computed(() => this._autocomplete.items().length > 0);

	constructor() {
		effect(() => {
			if (this._visible()) {
				this._viewContainerRef.clear();
			} else {
				this._viewContainerRef.createEmbeddedView(this._templateRef);
			}
		});
	}
}
