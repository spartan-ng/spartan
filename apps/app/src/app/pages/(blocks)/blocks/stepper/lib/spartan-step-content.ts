import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * Content for a `hlm-step` that will be rendered lazily.
 */
@Directive({
	selector: 'ng-template[spartanStepContent]',
})
export class SpartanStepContent<C> {
	public readonly template = inject<TemplateRef<C>>(TemplateRef);
}
