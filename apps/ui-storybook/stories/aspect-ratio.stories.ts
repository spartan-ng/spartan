import { HlmAspectRatioDirective } from '@spartan-ng/helm/aspect-ratio';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export type AspectRatio = { ratio: string | number };
const meta: Meta<AspectRatio> = {
	title: 'Aspect Ratio',
	component: HlmAspectRatioDirective,
	tags: ['autodocs'],
	args: { ratio: '16/9' },
	argTypes: {
		ratio: {
			options: ['16/9', '1/1', '5/4', '3/2', 1.234],
			control: {
				type: 'select',
			},
		},
	},
	decorators: [
		moduleMetadata({
			imports: [HlmAspectRatioDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<AspectRatio>;

export const Default: Story = {
	args: {
		ratio: '16/9',
	},
	render: ({ ratio }) => ({
		props: {
			ratio,
		},
		template: `
      <div class='max-w-xl overflow-hidden rounded-xl drop-shadow'>
        <div [hlmAspectRatio]='ratio'>
          <img
            alt='Mountain views'
            src='/mountains.jpg'
          />
        </div>
      </div>
    `,
	}),
};
