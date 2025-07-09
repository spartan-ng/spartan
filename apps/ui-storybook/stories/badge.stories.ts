import { HlmBadgeDirective } from '@spartan-ng/helm/badge';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

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
