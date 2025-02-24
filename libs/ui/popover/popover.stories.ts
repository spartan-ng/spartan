import { NgIcon } from '@ng-icons/core';
import { BrnPopoverComponent, BrnPopoverImports } from '@spartan-ng/brain/popover';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { HlmButtonDirective } from '../button/helm/src';
import { HlmIconDirective } from '../icon/helm/src';
import { HlmInputDirective } from '../input/helm/src';
import { HlmLabelDirective } from '../label/helm/src';
import { HlmPopoverImports } from './helm/src';

const meta: Meta<BrnPopoverComponent> = {
	title: 'Popover',
	component: BrnPopoverComponent,
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
			imports: [
				BrnPopoverImports,
				HlmPopoverImports,
				HlmButtonDirective,
				HlmLabelDirective,
				HlmInputDirective,
				NgIcon,
				HlmIconDirective,
			],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnPopoverComponent>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <brn-popover ${argsToTemplate(args)}>
    <div class='flex flex-col items-center justify-center py-80'>
        <button id='edit-profile' variant='outline' brnPopoverTrigger hlmBtn>Open Popover</button>
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
    </brn-popover>
    `,
	}),
};
