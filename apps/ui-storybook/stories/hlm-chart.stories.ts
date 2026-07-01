import { HlmChart, HlmChartImports } from '@spartan-ng/helm/chart';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Chart',
	component: HlmChart,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmChartImports],
		}),
	],
} as Meta<HlmChart>;

type Story = StoryObj<HlmChart>;

export const Default: Story = {
	render: () => ({
		template: `

		`,
	}),
};
