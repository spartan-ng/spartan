import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-disabled',
	imports: [HlmButtonImports, HlmTooltipImports],
	template: `
		<button [hlmTooltip]="'Simple tooltip'" [tooltipDisabled]="true" hlmBtn variant="outline">Simple</button>
	`,
})
export class TooltipDisabled {}
