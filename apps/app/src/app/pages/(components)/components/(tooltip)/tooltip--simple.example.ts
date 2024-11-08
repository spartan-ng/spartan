import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
	selector: 'spartan-tooltip-simple',
	standalone: true,
	imports: [
		HlmTooltipComponent,
		HlmTooltipTriggerDirective,
		HlmButtonDirective,
	],
	template: `
		<button [hlmTooltipTrigger]="'Simple tooltip'" aria-describedby="Simple tooltip" hlmBtn variant="outline">
			Simple
		</button>
	`,
})
export class TooltipSimpleComponent {}

export const simpleCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
	selector: 'spartan-tooltip-simple',
	standalone: true,
	imports: [
		HlmTooltipComponent,
		HlmTooltipTriggerDirective,
		HlmButtonDirective,
	],
	template: \`
		<button [hlmTooltipTrigger]="'Simple tooltip'" aria-describedby="Simple tooltip" hlmBtn variant="outline">
			Simple
		</button>
	\`,
})
export class TooltipSimpleComponent {}
`;

