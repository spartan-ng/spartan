import { computed, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnSelectBase } from './brn-select.token';

@Directive({
	selector: '[brnSelectValues]',
})
export class BrnSelectValues<T> {
	private readonly _templateRef = inject(TemplateRef<T>);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	private readonly _select = injectBrnSelectBase<T>();

	protected readonly _values = computed<T[] | null>(() => {
		const values = this._select.value();

		if (values === null) {
			return null;
		}

		return Array.isArray(values) ? values : [values];
	});

	constructor() {
		effect(() => {
			const values = this._values();
			if (values?.length) {
				this._viewContainerRef.clear();
				this._viewContainerRef.createEmbeddedView(this._templateRef, {
					$implicit: values,
				});
			} else {
				this._viewContainerRef.clear();
			}
		});
	}
}
