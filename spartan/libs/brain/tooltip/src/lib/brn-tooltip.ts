import { Directive, type TemplateRef, signal } from '@angular/core';

@Directive({
	selector: '[brnTooltip]',
})
export class BrnTooltip {
	public readonly tooltipTemplate = signal<TemplateRef<unknown> | null>(null);
}
