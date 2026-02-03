import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';

@Component({
	selector: 'spartan-popover-preview',
	imports: [HlmPopoverImports, HlmButtonImports, HlmLabelImports, HlmInputImports],
	template: `
		<hlm-popover sideOffset="5">
			<button id="edit-profile" hlmPopoverTrigger hlmBtn variant="outline">Open Popover</button>
			<hlm-popover-content class="grid w-80 gap-4" *hlmPopoverPortal="let ctx">
				<div class="space-y-2">
					<h4 class="leading-none font-medium">Dimensions</h4>
					<p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
				</div>
				<div class="grid gap-2">
					<div class="grid grid-cols-3 items-center gap-4">
						<label hlmLabel for="width">Width</label>
						<input hlmInput id="width" [defaultValue]="'100%'" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<label hlmLabel for="maxWidth">Max. width</label>
						<input hlmInput id="maxWidth" [defaultValue]="'300px'" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<label hlmLabel for="height">Height</label>
						<input hlmInput id="height" [defaultValue]="'25px'" class="col-span-2 h-8" />
					</div>
					<div class="grid grid-cols-3 items-center gap-4">
						<label hlmLabel for="maxHeight">Max. height</label>
						<input hlmInput id="maxHeight" [defaultValue]="'none'" class="col-span-2 h-8" />
					</div>
				</div>
			</hlm-popover-content>
		</hlm-popover>
	`,
})
export class PopoverPreview {}

export const defaultImports = `
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
`;

export const defaultSkeleton = `
<hlm-popover>
  <button hlmPopoverTrigger>Open Popover</button>
  <hlm-popover-content *hlmPopoverPortal="let ctx"></hlm-popover-content>
</hlm-popover>
`;
