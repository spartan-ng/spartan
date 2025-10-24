import { HlmItem, HlmItemImports } from '@spartan-ng/helm/item';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Item',
	component: HlmItem,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmItemImports],
		}),
	],
} as Meta<HlmItem>;

type Story = StoryObj<HlmItem>;

export const Default: Story = {
	render: () => ({
		template: `

		`,
	}),
};
