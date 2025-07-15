import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTooltipTrigger } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-simple',
	imports: [HlmTooltipTrigger, HlmButton],
	template: `
		<button [hlmTooltipTrigger]="'Simple tooltip'" aria-describedby="Simple tooltip" hlmBtn variant="outline">
			Simple
		</button>
	`,
})
export class TooltipSimple {}
