import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-popover-basic',
	imports: [HlmPopoverImports, HlmButtonImports],
	template: `
		<hlm-popover sideOffset="5" align="start">
			<button hlmPopoverTrigger hlmBtn variant="outline">Open Popover</button>
			<hlm-popover-content *hlmPopoverPortal="let ctx">
				<hlm-popover-header>
					<div hlmPopoverTitle>Dimensions</div>
					<p>Set the dimensions for the layer.</p>
				</hlm-popover-header>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class PopoverBasic {}
