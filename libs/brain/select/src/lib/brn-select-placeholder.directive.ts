import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
	standalone: true,
	selector: '[brnSelectPlaceholder], [hlmSelectPlaceholder]',
})
export class BrnSelectPlaceholderDirective {
	/** @internale */
	public readonly templateRef = inject<TemplateRef<void>>(TemplateRef);
}
