import { computed, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectValueTemplate]',
})
export class BrnSelectValueTemplate<T> {
	private readonly _templateRef = inject(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	private readonly _select = injectBrnSelectBase<T>();

	protected readonly _value = computed<T | null>(() => {
		const value = this._select.value();

		if (value === null) {
			return null;
		}

		return value as T;
	});

	constructor() {
		effect(() => {
			const value = this._value();
			if (value !== null) {
				this._viewContainerRef.clear();
				this._viewContainerRef.createEmbeddedView(this._templateRef, {
					$implicit: value,
				});
			} else {
				this._viewContainerRef.clear();
			}
		});
	}
}
