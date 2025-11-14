import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

@Component({
	selector: 'spartan-collapsible-animated-example',
	imports: [HlmCollapsibleImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideChevronsUpDown })],
	template: `
		<hlm-collapsible class="flex w-[350px] flex-col gap-2">
			<div class="flex items-center justify-between gap-4 px-4">
				<h4 class="text-sm font-semibold">&#64;peduarte starred 3 repositories</h4>
				<button hlmCollapsibleTrigger hlmBtn variant="ghost" size="icon" class="size-8">
					<ng-icon name="lucideChevronsUpDown" />
					<span class="sr-only">Toggle</span>
				</button>
			</div>
			<div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;radix-ui/primitives</div>
			<hlm-collapsible-content
				class="flex origin-top flex-col gap-2 transition-all ease-out data-[state=closed]:flex data-[state=closed]:-translate-y-1 data-[state=closed]:scale-80 data-[state=closed]:opacity-0"
			>
				<div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;radix-ui/colors</div>
				<div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;stitches/react</div>
			</hlm-collapsible-content>
		</hlm-collapsible>
	`,
})
export class CollapsibleAnimatedExample {}
