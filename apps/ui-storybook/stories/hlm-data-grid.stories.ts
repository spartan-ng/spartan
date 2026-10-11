import { HlmDataGrid, HlmDataGridImports } from '@spartan-ng/helm/data-grid';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Data Grid',
	component: HlmDataGrid,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmDataGridImports],
		}),
	],
} as Meta<HlmDataGrid>;

type Story = StoryObj<HlmDataGrid>;

export const Default: Story = {
	render: () => ({
		template: `

		`,
	}),
};
