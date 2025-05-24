import { Directive, type TemplateRef, signal } from '@angular/core';

@Directive({
	selector: '[brnTooltip]',
})
export class BrnTooltipDirective {
	public readonly tooltipTemplate = signal<TemplateRef<unknown> | null>(null);
}
