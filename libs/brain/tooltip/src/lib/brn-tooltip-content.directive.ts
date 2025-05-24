import { Directive, TemplateRef, inject } from '@angular/core';
import { BrnTooltipDirective } from './brn-tooltip.directive';

@Directive({
	selector: '[brnTooltipContent]',
})
export class BrnTooltipContentDirective {
	private readonly _brnTooltipDirective = inject(BrnTooltipDirective, { optional: true });
	private readonly _tpl = inject(TemplateRef);

	constructor() {
		if (!this._brnTooltipDirective || !this._tpl) return;
		this._brnTooltipDirective.tooltipTemplate.set(this._tpl);
	}
}
