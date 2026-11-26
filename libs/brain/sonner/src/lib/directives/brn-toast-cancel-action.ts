// Adapted from Sonner (https://github.com/emilkowalski/sonner), MIT License, Copyright (c) 2023 Emil Kowalski,
// via ngx-sonner (https://github.com/tutkli/ngx-sonner), MIT License, Copyright (c) 2024 Clara Castillo.
import { Directive, inject, TemplateRef } from '@angular/core';
import { ToastActionTemplateContext } from '../types';

/**
 * Utils directory to typecheck the context of the templateRef
 * {@link ToastActionTemplateContext} context for content
 */
@Directive({
	selector: '[brnToastCancelAction]',
	exportAs: 'toastCancelAction',
})
export class BrnToastCancelAction {
	public readonly templateRef = inject<TemplateRef<ToastActionTemplateContext>>(TemplateRef);
	static ngTemplateContextGuard(
		_directive: BrnToastCancelAction,
		context: unknown,
	): context is ToastActionTemplateContext {
		return true;
	}
}
