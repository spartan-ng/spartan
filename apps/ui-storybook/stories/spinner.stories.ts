import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmSpinner> = {
	title: 'Spinner',
	component: HlmSpinner,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmSpinner],
		}),
	],
	render: ({ ...args }) => ({
		props: args,
		template: `
    		<hlm-spinner  class="size-8" />
		`,
	}),
};

export default meta;
type Story = StoryObj<HlmSpinner>;

export const Default: Story = {};
