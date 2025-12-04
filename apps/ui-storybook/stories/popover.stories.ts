import { NgIcon } from '@ng-icons/core';
import { BrnPopover, BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

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
			imports: [BrnPopoverImports, HlmPopoverImports, HlmButton, HlmLabel, HlmInput, NgIcon, HlmIcon],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnPopover>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <hlm-popover ${argsToTemplate(args)}>
    <div class='flex flex-col items-center justify-center py-80'>
        <button id='edit-profile' variant='outline' hlmPopoverTrigger hlmBtn>Open Popover</button>
    </div>
    <div hlmPopoverContent class='w-80 grid gap-4' *brnPopoverContent='let ctx'>
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
    </div>
    </hlm-popover>
    `,
	}),
};
