import { Component } from '@angular/core';
import {
	BrnCollapsibleComponent,
	BrnCollapsibleContentComponent,
	BrnCollapsibleTriggerDirective,
} from '@spartan-ng/brain/collapsible';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
	selector: 'spartan-collapsible-preview',
	imports: [
		BrnCollapsibleComponent,
		BrnCollapsibleTriggerDirective,
		HlmButtonDirective,
		BrnCollapsibleContentComponent,
	],
	template: `
		<brn-collapsible class="flex w-[350px] flex-col space-y-2">
			<div class="flex items-center justify-between space-x-4 px-4">
				<h4 class="text-sm font-semibold">&#64;peduarte starred 3 repositories</h4>
				<button brnCollapsibleTrigger hlmBtn variant="ghost" size="sm" class="w-9 p-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
						/>
					</svg>
					<span class="sr-only">Toggle</span>
				</button>
			</div>
			<div class="border-border rounded-md border px-4 py-3 font-mono text-sm">&#64;radix-ui/primitives</div>
			<brn-collapsible-content class="space-y-2">
				<div class="border-border rounded-md border px-4 py-3 font-mono text-sm">&#64;radix-ui/colors</div>
				<div class="border-border rounded-md border px-4 py-3 font-mono text-sm">&#64;stitches/react</div>
			</brn-collapsible-content>
		</brn-collapsible>
	`,
})
export class CollapsiblePreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnCollapsibleComponent,
  BrnCollapsibleContentComponent,
  BrnCollapsibleTriggerDirective,
} from '@spartan-ng/brain/collapsible';

@Component({
  selector: 'spartan-collapsible-preview',
  standalone: true,
  imports: [
    BrnCollapsibleComponent,
    BrnCollapsibleTriggerDirective,
    HlmButtonDirective,
    BrnCollapsibleContentComponent,
  ],
  template: \`
    <brn-collapsible class="flex flex-col w-[350px] space-y-2">
      <div class="flex items-center justify-between px-4 space-x-4">
        <h4 class="text-sm font-semibold">&#64;peduarte starred 3 repositories</h4>
        <button brnCollapsibleTrigger hlmBtn variant="ghost" size="sm" class="p-0 w-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
          <span class="sr-only">Toggle</span>
        </button>
      </div>
      <div class="px-4 py-3 font-mono text-sm border rounded-md border-border">&#64;radix-ui/primitives</div>
      <brn-collapsible-content class="space-y-2">
        <div class="px-4 py-3 font-mono text-sm border rounded-md border-border">&#64;radix-ui/colors</div>
        <div class="px-4 py-3 font-mono text-sm border rounded-md border-border">&#64;stitches/react</div>
      </brn-collapsible-content>
    </brn-collapsible>
  \`,
})
export class CollapsiblePreviewComponent {}
`;

export const defaultImports = `
import {
  BrnCollapsibleComponent,
  BrnCollapsibleContentComponent,
  BrnCollapsibleTriggerDirective,
} from '@spartan-ng/brain/collapsible';
`;

export const defaultSkeleton = `
<brn-collapsible>
  <button brnCollapsibleTrigger>Can I use this in my project?</button>
    <brn-collapsible-content>
    Yes. Free to use for personal and commercial projects. No attribution
    required.
    </brn-collapsible-content>
</brn-collapsible>
`;
