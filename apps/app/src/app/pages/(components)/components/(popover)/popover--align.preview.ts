import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-popover-align',
	imports: [HlmPopoverImports, HlmButtonImports],
	template: `
		<div class="flex gap-6">
			<hlm-popover sideOffset="5" align="start">
				<button hlmPopoverTrigger hlmBtn variant="outline">Start</button>
				<hlm-popover-content class="w-40" *hlmPopoverPortal="let ctx">Aligned to start</hlm-popover-content>
			</hlm-popover>
			<hlm-popover sideOffset="5" align="center">
				<button hlmPopoverTrigger hlmBtn variant="outline">Center</button>
				<hlm-popover-content class="w-40" *hlmPopoverPortal="let ctx">Aligned to center</hlm-popover-content>
			</hlm-popover>
			<hlm-popover sideOffset="5" align="end">
				<button hlmPopoverTrigger hlmBtn variant="outline">End</button>
				<hlm-popover-content class="w-40" *hlmPopoverPortal="let ctx">Aligned to end</hlm-popover-content>
			</hlm-popover>
		</div>
	`,
})
export class PopoverAlign {}
