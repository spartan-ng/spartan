import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { HlmBadgeDirective } from './helm/src';

const meta: Meta<HlmBadgeDirective> = {
	title: 'Badge',
	component: HlmBadgeDirective,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			options: ['default', 'secondary', 'destructive', 'outline'],
			control: {
				type: 'select',
			},
			table: {
				defaultValue: { summary: 'default' },
			},
		},
		size: {
			options: ['default', 'lg'],
			control: {
				type: 'select',
			},
			table: {
				defaultValue: { summary: 'default' },
			},
		},
		static: {
			control: { type: 'boolean' },
			table: {
				defaultValue: { summary: 'false' },
			},
		},
	},
	args: {
		static: false,
	},
	decorators: [
		moduleMetadata({
			imports: [HlmBadgeDirective],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
    <span hlmBadge ${argsToTemplate(args)}>I am a badge</span>
    `,
	}),
};

export default meta;
type Story = StoryObj<HlmBadgeDirective>;

export const Default: Story = {
	args: {
		variant: 'default',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
	},
};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
	},
};
