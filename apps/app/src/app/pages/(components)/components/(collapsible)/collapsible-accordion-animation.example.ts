import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

@Component({
	selector: 'spartan-collapsible-accordion-animated-example',
	imports: [HlmCollapsibleImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	template: `
		<hlm-collapsible class="group/collapsible flex w-87.5 flex-col gap-2">
			<div class="flex items-center justify-between gap-4 px-4">
				<h4 class="text-sm font-semibold">&#64;peduarte starred 3 repositories</h4>
				<button hlmCollapsibleTrigger hlmBtn variant="ghost" size="icon">
					<ng-icon
						name="lucideChevronRight"
						class="transition-transform group-data-[state=open]/collapsible:rotate-90"
					/>
					<span class="sr-only">Toggle</span>
				</button>
			</div>
			<hlm-collapsible-content
				[hideWhenClosed]="false"
				class="overflow-hidden transition-all duration-200 ease-out data-[state=closed]:h-0 data-[state=open]:h-(--brn-collapsible-content-height)"
			>
				<div class="flex flex-col gap-2">
					<div class="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
					<div class="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
					<div class="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
				</div>
			</hlm-collapsible-content>
		</hlm-collapsible>
	`,
})
export class CollapsibleAccordionAnimatedExample {}
