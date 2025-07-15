import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmSpinner> = {
	title: 'Spinner',
	component: HlmSpinner,
	tags: ['autodocs'],
	argTypes: {
		size: {
			options: ['default', 'xs', 'sm'],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmSpinner],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
    <hlm-spinner ${argsToTemplate(args)}></hlm-spinner>
    `,
	}),
};

export default meta;
type Story = StoryObj<HlmSpinner>;

export const Default: Story = {};
