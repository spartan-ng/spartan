import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmSpinner> = {
	title: 'Spinner',
	component: HlmSpinner,
	tags: ['autodocs'],
	argTypes: {
		userClass: {
			options: ['size-6', 'size-8', 'size-10'],
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
    		<hlm-spinner  class="${args.userClass || 'size-8'}" />
		`,
	}),
};

export default meta;
type Story = StoryObj<HlmSpinner>;

export const Default: Story = {};
