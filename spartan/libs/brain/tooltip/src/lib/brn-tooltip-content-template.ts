import { Directive, TemplateRef, inject } from '@angular/core';
import { BrnTooltip } from './brn-tooltip';

@Directive({
	selector: '[brnTooltipContent]',
})
export class BrnTooltipContentTemplate {
	private readonly _brnTooltipDirective = inject(BrnTooltip, { optional: true });
	private readonly _tpl = inject(TemplateRef);

	constructor() {
		if (!this._brnTooltipDirective || !this._tpl) return;
		this._brnTooltipDirective.tooltipTemplate.set(this._tpl);
	}
}
