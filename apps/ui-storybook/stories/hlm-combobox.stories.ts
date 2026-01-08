import { HlmCombobox, HlmComboboxImports } from '@spartan-ng/helm/combobox';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Combobox',
	component: HlmCombobox,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmComboboxImports],
		}),
	],
} as Meta<HlmCombobox>;

type Story = StoryObj<HlmCombobox>;

export const Default: Story = {
	render: () => ({
		template: `

		`,
	}),
};
