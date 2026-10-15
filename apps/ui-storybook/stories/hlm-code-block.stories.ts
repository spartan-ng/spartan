import { HlmCodeBlock, HlmCodeBlockImports } from '@spartan-ng/helm/code-block';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Code Block',
	component: HlmCodeBlock,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCodeBlockImports],
		}),
	],
} as Meta<HlmCodeBlock>;

type Story = StoryObj<HlmCodeBlock>;

export const Default: Story = {
	render: () => ({
		template: `

		`,
	}),
};
