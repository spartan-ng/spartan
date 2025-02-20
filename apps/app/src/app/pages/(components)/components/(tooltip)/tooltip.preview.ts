import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
	selector: 'spartan-tooltip-preview',
	imports: [
		HlmTooltipComponent,
		HlmTooltipTriggerDirective,
		BrnTooltipContentDirective,
		HlmButtonDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucidePlus })],
	template: `
		<div>
			<hlm-tooltip>
				<button hlmTooltipTrigger aria-describedby="Hello world" hlmBtn variant="outline">Default</button>
				<span *brnTooltipContent class="flex items-center">
					Add to library
					<ng-icon hlm class="ml-2" size="sm" name="lucidePlus" />
				</span>
			</hlm-tooltip>
		</div>
	`,
})
export class TooltipPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective, provideIcons } from '@spartan-ng/ui-icon-helm';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';

@Component({
  selector: 'spartan-tooltip-preview',
  standalone: true,
  imports: [
    HlmTooltipComponent,
    HlmTooltipTriggerDirective,
    BrnTooltipContentDirective,
    HlmButtonDirective,
    HlmIconDirective,
  ],
  providers: [provideIcons({ lucidePlus })],
  template: \`
    <hlm-tooltip>
      <button hlmTooltipTrigger aria-describedby="Hello world" hlmBtn variant="outline">Default</button>
      <span *brnTooltipContent class="flex items-center">
        Add to library
        <ng-icon hlm class="ml-2" size="sm" name="lucidePlus" />
      </span>
    </hlm-tooltip>
  \`,
})
export class TooltipPreviewComponent {}
`;

export const defaultImports = `
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/ui-tooltip-helm';
`;
export const defaultSkeleton = `
<hlm-tooltip>
  <button hlmTooltipTrigger aria-describedby="Hello world">Default</button>
  <span *brnTooltipContent>Add to library</span>
</hlm-tooltip>
`;
