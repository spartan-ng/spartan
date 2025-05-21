import { BrnCollapsibleComponent, BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnCollapsibleComponent> = {
	title: 'Collapsible',
	component: BrnCollapsibleComponent,
	tags: ['autodocs'],
	args: {
		disabled: false,
	},
	argTypes: {
		disabled: {
			control: {
				type: 'boolean',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmButtonDirective, BrnCollapsibleImports],
		}),
	],
};

export default meta;
type Story = StoryObj<{}>;

export const Default: Story = {
	render: ({ ...args }) => ({
		template: `
    <brn-collapsible class="flex flex-col w-[350px] space-y-2" ${argsToTemplate(args)}>
      <div class="flex items-center justify-between px-4 space-x-4">
        <h4 class="text-sm font-semibold">
          &#64;peduarte starred 3 repositories
        </h4>
        <button brnCollapsibleTrigger hlmBtn variant="ghost" size="sm" class="p-0 w-9">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
             <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
             </svg>
            <span class="sr-only">Toggle</span>
          </button>
      </div>
      <div class="px-4 py-3 font-mono text-sm border rounded-md border-border">
        &#64;radix-ui/primitives
      </div>
      <brn-collapsible-content class="space-y-2">
        <div class="px-4 py-3 font-mono text-sm border rounded-md border-border">
          &#64;radix-ui/colors
        </div>
        <div class="px-4 py-3 font-mono text-sm border rounded-md border-border">
          &#64;stitches/react
        </div>
      </brn-collapsible-content>
    </brn-collapsible>
    `,
	}),
};
