import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmSpinnerComponent> = {
	title: 'Spinner',
	component: HlmSpinnerComponent,
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
			imports: [HlmSpinnerComponent],
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
type Story = StoryObj<HlmSpinnerComponent>;

export const Default: Story = {};
