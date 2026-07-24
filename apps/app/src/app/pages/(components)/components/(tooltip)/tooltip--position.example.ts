import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-position',
	imports: [HlmButtonImports, HlmTooltipImports],
	host: {
		class: 'flex flex-col space-y-2',
	},
	template: `
		<button type="button" hlmBtn variant="outline" hlmTooltip="Tooltip content" position="top">Top</button>

		<div class="flex space-x-2">
			<button type="button" hlmBtn variant="outline" hlmTooltip="Tooltip content" position="left">Left</button>
			<button type="button" hlmBtn variant="outline" hlmTooltip="Tooltip content" position="right">Right</button>
		</div>

		<button type="button" hlmBtn variant="outline" hlmTooltip="Tooltip content" position="bottom">Bottom</button>
	`,
})
export class TooltipPosition {}
