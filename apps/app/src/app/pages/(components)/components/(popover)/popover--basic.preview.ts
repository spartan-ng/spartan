import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-popover-basic',
	imports: [HlmPopoverImports, HlmButtonImports, HlmLabelImports, HlmInputImports],
	template: `
		<hlm-popover sideOffset="5">
			<button hlmPopoverTrigger hlmBtn variant="outline">Open Popover</button>
			<hlm-popover-content class="grid w-80 gap-4" *hlmPopoverPortal="let ctx">
				<div hlmPopoverTitle>Dimensions</div>
				<p>Set the dimensions for the layer.</p>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class PopoverBasic {}
