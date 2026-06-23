import { Component } from '@angular/core';
import { provideBrnTooltipGroup } from '@spartan-ng/brain/tooltip';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-group',
	imports: [HlmButtonImports, HlmTooltipImports],
	providers: [provideBrnTooltipGroup({ skipDelayDuration: 300 })],
	template: `
		<div class="flex gap-2">
			<button [hlmTooltip]="'Save'" hlmBtn variant="outline">Save</button>
			<button [hlmTooltip]="'Copy'" hlmBtn variant="outline">Copy</button>
			<button [hlmTooltip]="'Paste'" hlmBtn variant="outline">Paste</button>
		</div>
	`,
})
export class TooltipGroup {}
