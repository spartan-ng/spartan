import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmSkeleton> = {
	title: 'Skeleton',
	component: HlmSkeleton,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmSkeleton],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmSkeleton>;

export const Default: Story = {
	render: () => ({
		template: `
   <div class='flex items-center p-4 m-4 border rounded-lg w-fit border-border space-x-4'>
      <hlm-skeleton class='w-12 h-12 rounded-full' />
      <div class='space-y-2'>
        <hlm-skeleton class='h-4 w-[250px]' />
        <hlm-skeleton class='h-4 w-[200px]' />
      </div>
    </div>
    `,
	}),
};
