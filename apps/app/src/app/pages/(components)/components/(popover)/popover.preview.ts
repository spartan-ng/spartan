import { Component } from '@angular/core';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';

@Component({
	selector: 'spartan-popover-preview',
	imports: [
		BrnPopoverComponent,
		BrnPopoverTriggerDirective,
		BrnPopoverContentDirective,
		HlmPopoverContentDirective,
		HlmButtonDirective,
		HlmLabelDirective,
		HlmInputDirective,
	],
	template: `
		<brn-popover sideOffset="5">
			<button id="edit-profile" variant="outline" brnPopoverTrigger hlmBtn>Open Popover</button>
			<div hlmPopoverContent class="grid w-80 gap-4" *brnPopoverContent="let ctx">
				<div class="space-y-2">
					<h4 class="font-medium leading-none">Dimensions</h4>
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
			</div>
		</brn-popover>
	`,
})
export class PopoverPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'spartan-popover-preview',
  standalone: true,
  imports: [
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    BrnPopoverContentDirective,
    HlmPopoverContentDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
  ],
  template: \`
    <brn-popover sideOffset="5">
      <button id="edit-profile" variant="outline" brnPopoverTrigger hlmBtn>Open Popover</button>
      <div hlmPopoverContent class="w-80 grid gap-4" *brnPopoverContent="let ctx">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
        <div class="grid gap-2">
          <div class="items-center grid grid-cols-3 gap-4">
            <label hlmLabel for="width">Width</label>
            <input hlmInput id="width" [defaultValue]="'100%'" class="h-8 col-span-2" />
          </div>
          <div class="items-center grid grid-cols-3 gap-4">
            <label hlmLabel for="maxWidth">Max. width</label>
            <input hlmInput id="maxWidth" [defaultValue]="'300px'" class="h-8 col-span-2" />
          </div>
          <div class="items-center grid grid-cols-3 gap-4">
            <label hlmLabel for="height">Height</label>
            <input hlmInput id="height" [defaultValue]="'25px'" class="h-8 col-span-2" />
          </div>
          <div class="items-center grid grid-cols-3 gap-4">
            <label hlmLabel for="maxHeight">Max. height</label>
            <input hlmInput id="maxHeight" [defaultValue]="'none'" class="h-8 col-span-2" />
          </div>
        </div>
      </div>
    </brn-popover>
  \`,
})
export class PopoverPreviewComponent {}
`;

export const defaultImports = `
import {
  BrnPopoverCloseDirective,
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';
import { HlmPopoverCloseDirective, HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
`;
export const defaultSkeleton = `
 <brn-popover>
   <button brnPopoverTrigger >Open Popover</button>
   <div hlmPopoverContent *brnPopoverContent="let ctx"></div>
</brn-popover>
`;
