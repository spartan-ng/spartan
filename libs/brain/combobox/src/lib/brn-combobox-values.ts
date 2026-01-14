import { computed, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnComboboxBase } from './brn-combobox.token';

@Directive({
	selector: '[brnComboboxValues]',
})
export class BrnComboboxValues<T> {
	private readonly _templateRef = inject(TemplateRef<T>);
	private readonly _viewContainerRef = inject(ViewContainerRef);

	private readonly _combobox = injectBrnComboboxBase<T>();

	protected readonly _values = computed<T[] | null>(() => {
		const values = this._combobox.value();

		if (values == null) {
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
