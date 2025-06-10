import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
	selector: '[brnSelectPlaceholder], [hlmSelectPlaceholder]',
})
export class BrnSelectPlaceholderDirective {
	/** @internale */
	public readonly templateRef = inject<TemplateRef<void>>(TemplateRef);
}
