import { BrnSeparator } from '@spartan-ng/brain/separator';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<BrnSeparator> = {
	title: 'Separator',
	component: BrnSeparator,
	tags: ['autodocs'],
	args: {
		orientation: 'horizontal',
		decorative: false,
	},
	argTypes: {
		orientation: {
			options: ['horizontal', 'vertical'],
			control: {
				type: 'select',
			},
			table: {
				defaultValue: { summary: 'horizontal' },
			},
		},
		decorative: {
			control: {
				type: 'boolean',
			},
			table: {
				defaultValue: { summary: 'false' },
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [BrnSeparator, HlmSeparator],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSeparator>;

export const Default: Story = {
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div>
      <div class='space-y-1'>
        <h4 class='text-sm font-medium leading-none'>Radix Primitives</h4>
        <p class='text-sm text-muted-foreground'>
          An open-source UI component library.
        </p>
      </div>
      <hlm-separator ${argsToTemplate(args)} class='my-4' /> 
	  <div class='flex items-center h-5 text-sm space-x-4'>
        <div>Blog</div>
        <hlm-separator decorative orientation='vertical' /> 
		<div>Docs</div>
        <hlm-separator decorative orientation='vertical' /> 
		<div>Source</div>
      </div>
    </div>
       `,
	}),
};
