import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmTooltipTriggerDirective } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-simple',
	imports: [HlmTooltipTriggerDirective, HlmButtonDirective],
	template: `
		<button [hlmTooltipTrigger]="'Simple tooltip'" aria-describedby="Simple tooltip" hlmBtn variant="outline">
			Simple
		</button>
	`,
})
export class TooltipSimpleComponent {}
