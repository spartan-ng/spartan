import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { BrnSeparatorComponent } from './brain/src';
import { HlmSeparatorDirective } from './helm/src';

const meta: Meta<BrnSeparatorComponent> = {
	title: 'Separator',
	component: BrnSeparatorComponent,
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
			imports: [BrnSeparatorComponent, HlmSeparatorDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<BrnSeparatorComponent>;

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
      <brn-separator hlmSeparator ${argsToTemplate(args)} class='my-4' />
      <div class='flex items-center h-5 text-sm space-x-4'>
        <div>Blog</div>
        <brn-separator decorative hlmSeparator orientation='vertical' />
        <div>Docs</div>
        <brn-separator decorative hlmSeparator orientation='vertical' />
        <div>Source</div>
      </div>
    </div>
       `,
	}),
};
