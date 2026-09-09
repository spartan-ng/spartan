import { Directive, inject, TemplateRef } from '@angular/core';
import { ToastActionTemplateContext } from '../types';

/**
 * Utils directory to typecheck the context of the templateRef
 * {@link ToastActionTemplateContext} context for content
 */
@Directive({
	selector: '[brnToastAction]',
	exportAs: 'toastAction',
})
export class BrnToastAction {
	public readonly templateRef = inject<TemplateRef<ToastActionTemplateContext>>(TemplateRef);
	static ngTemplateContextGuard(_directive: BrnToastAction, context: unknown): context is ToastActionTemplateContext {
		return true;
	}
}
