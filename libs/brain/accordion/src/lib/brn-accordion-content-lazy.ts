import { DestroyRef, Directive, effect, inject, TemplateRef, untracked, ViewContainerRef } from '@angular/core';
import { injectBrnAccordionItem } from './brn-accordion-token';

@Directive({
	selector: 'ng-template[brnAccordionContentLazy]',
	exportAs: 'brnAccordionContentLazy',
})
export class BrnAccordionContentLazy {
	private readonly _item = injectBrnAccordionItem();
	private readonly _templateRef = inject(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _destroyRef = inject(DestroyRef);

	private _hasBeenActivated = false;

	constructor() {
		if (!this._item) {
			throw Error('Accordion Content Lazy can only be used inside an AccordionItem. Add brnAccordionItem to parent.');
		}

		this._destroyRef.onDestroy(() => this._viewContainerRef.clear());

		effect(() => {
			const state = this._item.state();

			untracked(() => {
				if (state === 'open' && !this._hasBeenActivated) {
					this._viewContainerRef.createEmbeddedView(this._templateRef);
					this._hasBeenActivated = true;
				}
			});
		});
	}
}
