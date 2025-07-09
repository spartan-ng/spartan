import { Component } from '@angular/core';
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-tooltip-preview',
	imports: [HlmTooltipComponent, HlmTooltipTriggerDirective, BrnTooltipContentDirective, HlmButtonDirective],
	template: `
		<div>
			<hlm-tooltip>
				<button hlmTooltipTrigger aria-describedby="Hello world" hlmBtn variant="outline">Default</button>
				<span *brnTooltipContent class="flex items-center">
					Add to library

					<span class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
						<svg
							class="bg-primary fill-primary z-50 block size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
							width="10"
							height="5"
							viewBox="0 0 30 10"
							preserveAspectRatio="none"
						>
							<polygon points="0,0 30,0 15,10"></polygon>
						</svg>
					</span>
				</span>
			</hlm-tooltip>
		</div>
	`,
})
export class TooltipPreviewComponent {}

export const defaultImports = `
import { BrnTooltipContentDirective } from '@spartan-ng/brain/tooltip';
import { HlmTooltipComponent, HlmTooltipTriggerDirective } from '@spartan-ng/helm/tooltip';
`;
export const defaultSkeleton = `
<hlm-tooltip>
  <button hlmTooltipTrigger aria-describedby="Hello world">Default</button>
  <span *brnTooltipContent>Add to library</span>
</hlm-tooltip>
`;
