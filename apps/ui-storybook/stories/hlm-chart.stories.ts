import { SpnBar, SpnBarChart, SpnCartesianGrid, SpnXAxis } from '@spartan-ng/charts';
import { HlmChartContainer, HlmChartImports } from '@spartan-ng/helm/chart';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Chart',
	component: HlmChartContainer,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmChartImports, SpnBarChart, SpnBar, SpnCartesianGrid, SpnXAxis],
		}),
	],
} as Meta<HlmChartContainer>;

type Story = StoryObj<HlmChartContainer>;

export const Default: Story = {
	render: () => ({
		props: {
			chartConfig: {
				desktop: { label: 'Desktop', color: '#2563eb' },
				mobile: { label: 'Mobile', color: '#60a5fa' },
			},
			margin: { top: 12, right: 12, bottom: 24, left: 12 },
			data: [
				{ month: 'January', desktop: 186, mobile: 80 },
				{ month: 'February', desktop: 305, mobile: 200 },
				{ month: 'March', desktop: 237, mobile: 120 },
				{ month: 'April', desktop: 73, mobile: 190 },
				{ month: 'May', desktop: 209, mobile: 130 },
				{ month: 'June', desktop: 214, mobile: 140 },
			],
		},
		template: `
			<hlm-chart-container class="h-64 w-96" [config]="chartConfig">
				<spn-bar-chart [data]="data" [margin]="margin">
					<spn-cartesian-grid />
					<spn-x-axis dataKey="month" axisLine="false" tickLine="false" tickSize="0" tickPadding="10" />
					<spn-bar dataKey="desktop" name="Desktop" fill="var(--color-desktop)" radius="4" />
					<spn-bar dataKey="mobile" name="Mobile" fill="var(--color-mobile)" radius="4" />
				</spn-bar-chart>
			</hlm-chart-container>
		`,
	}),
};
