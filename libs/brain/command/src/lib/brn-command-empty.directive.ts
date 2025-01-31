import { computed, Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { injectBrnCommand } from './brn-command.token';

@Directive({
	standalone: true,
	selector: '[brnCommandEmpty]',
})
export class BrnCommandEmptyDirective {
	private readonly _templateRef = inject<TemplateRef<void>>(TemplateRef);
	private readonly _viewContainerRef = inject(ViewContainerRef);
	private readonly _command = injectBrnCommand();

	/** Determine if the command has any visible items */
	private readonly _visible = computed(() => this._command.items().some((item) => item.visible()));

	constructor() {
		effect(() => {
			if (this._visible()) {
				this._viewContainerRef.clear();
			} else {
				this._viewContainerRef.createEmbeddedView(this._templateRef);
			}
		});
	}
}
