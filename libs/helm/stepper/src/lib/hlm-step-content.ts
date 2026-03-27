import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * Content for a `hlm-step` that will be rendered lazily.
 */
@Directive({
	selector: 'ng-template[hlmStepContent]',
})
export class HlmStepContent<C> {
	public readonly template = inject<TemplateRef<C>>(TemplateRef);
}
