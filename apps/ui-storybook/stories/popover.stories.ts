import { NgIcon } from '@ng-icons/core';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';

import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

const meta: Meta<BrnPopover> = {
	title: 'Popover',
	component: BrnPopover,
	tags: ['autodocs'],
	args: {
		align: 'center',
		sideOffset: 4,
	},
	argTypes: {
		align: { control: 'select', options: ['start', 'center', 'end'] },
		sideOffset: { control: 'number' },
	},
	decorators: [
		moduleMetadata({
			imports: [HlmPopoverImports, HlmButton, HlmLabel, HlmInput, NgIcon],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnPopover>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: { ...args, outsideClicks: 0 },
		template: `
	    <hlm-popover ${argsToTemplate(args)}>
	    <div class='flex flex-col items-center justify-center gap-4 py-80'>
	        <div class='flex items-center gap-4'>
	            <button id='edit-profile' variant='outline' hlmPopoverTrigger hlmBtn>Open Popover</button>
	            <button id='outside-action' variant='outline' hlmBtn (click)='outsideClicks = outsideClicks + 1'>Outside Action</button>
	        </div>
	        <p id='outside-click-count'>Outside clicks: {{ outsideClicks }}</p>
	    </div>
    <hlm-popover-content class='w-80 grid gap-4' *hlmPopoverPortal='let ctx'>
          <div class='space-y-2'>
            <h4 class='font-medium leading-none'>Dimensions</h4>
            <p class='text-sm text-muted-foreground'>
              Set the dimensions for the layer.
            </p>
          </div>
          <div class='grid gap-2'>
            <div class='items-center grid grid-cols-3 gap-4'>
              <label hlmLabel for='width'>Width</label>
              <input hlmInput
                id='width'
                [defaultValue]="'100%'"
                class='h-8 col-span-2'
              />
            </div>
            <div class='items-center grid grid-cols-3 gap-4'>
              <label hlmLabel for='maxWidth'>Max. width</label>
              <input hlmInput
                id='maxWidth'
                [defaultValue]="'300px'"
                class='h-8 col-span-2'
              />
            </div>
            <div class='items-center grid grid-cols-3 gap-4'>
              <label hlmLabel for='height'>Height</label>
              <input hlmInput
                id='height'
                [defaultValue]="'25px'"
                class='h-8 col-span-2'
              />
            </div>
            <div class='items-center grid grid-cols-3 gap-4'>
              <label hlmLabel for='maxHeight'>Max. height</label>
              <input hlmInput
                id='maxHeight'
                [defaultValue]="'none'"
                class='h-8 col-span-2'
              />
            </div>
          </div>
      </hlm-popover-content>
    </hlm-popover>
    `,
	}),
};

/**
 * Trigger pinned to the right edge with content wider than itself, inside a page tall
 * enough to scroll. Covers both positioning cases: the overlay has to be shifted back
 * into the viewport when it opens, and it has to keep following its trigger afterwards.
 */
export const NearViewportEdge: Story = {
	args: {
		align: 'start',
		sideOffset: 4,
	},
	render: ({ ...args }) => ({
		props: { ...args },
		template: `
    <hlm-popover ${argsToTemplate(args)}>
      <div class='flex justify-end py-[900px]'>
        <button id='edge-trigger' variant='outline' hlmPopoverTrigger hlmBtn>Edge</button>
      </div>
      <hlm-popover-content class='w-80' *hlmPopoverPortal='let ctx'>
        <p id='edge-content' class='text-sm'>Content wider than its trigger.</p>
      </hlm-popover-content>
    </hlm-popover>
    `,
	}),
};
