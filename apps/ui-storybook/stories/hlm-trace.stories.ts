import { HlmTrace, HlmTraceImports } from '@spartan-ng/helm/trace';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Trace',
	component: HlmTrace,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmTraceImports],
		}),
	],
} as Meta<HlmTrace>;

type Story = StoryObj<HlmTrace>;

export const Default: Story = {
	render: () => ({
		template: `

		`,
	}),
};
