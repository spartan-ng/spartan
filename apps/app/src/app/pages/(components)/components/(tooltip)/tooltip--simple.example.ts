import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-simple',
	imports: [HlmButtonImports, HlmTooltipImports],
	template: `
		<button [hlmTooltip]="'Simple tooltip'" hlmBtn variant="outline">Simple</button>
	`,
})
export class TooltipSimple {}
