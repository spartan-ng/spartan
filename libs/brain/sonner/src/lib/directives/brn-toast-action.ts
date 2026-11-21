// Adapted from Sonner (https://github.com/emilkowalski/sonner), MIT License, Copyright (c) 2023 Emil Kowalski,
// via ngx-sonner (https://github.com/tutkli/ngx-sonner), MIT License, Copyright (c) 2024 Clara Castillo.
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
