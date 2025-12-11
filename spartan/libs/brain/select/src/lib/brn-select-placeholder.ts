import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
	selector: '[brnSelectPlaceholder], [hlmSelectPlaceholder]',
})
export class BrnSelectPlaceholder {
	/** @internale */
	public readonly templateRef = inject<TemplateRef<void>>(TemplateRef);
}
