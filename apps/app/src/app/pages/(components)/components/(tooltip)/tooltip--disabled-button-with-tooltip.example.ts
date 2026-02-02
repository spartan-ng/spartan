import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-disabled-button-with-tooltip',
	imports: [HlmButtonImports, HlmTooltipImports],
	template: `
		<div hlmTooltip="Simple tooltip">
			<button hlmBtn variant="outline" disabled>Disabled Button</button>
		</div>
	`,
})
export class TooltipDisabledButtonWithTooltip {}
