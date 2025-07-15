import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
	selector: '[brnSelectValue], [hlmSelectValue]',
})
export class BrnSelectValueTemplate<T> {
	/** @internal */
	public readonly templateRef = inject<TemplateRef<BrnSelectValueContext<T>>>(TemplateRef);
}

export interface BrnSelectValueContext<T> {
	$implicit: T | T[];
}
