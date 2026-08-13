import { Component } from '@angular/core';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';

const revenue = [
	{ month: 'Jan', revenue: 186 },
	{ month: 'Feb', revenue: 305 },
	{ month: 'Mar', revenue: 237 },
	{ month: 'Apr', revenue: 273 },
	{ month: 'May', revenue: 209 },
	{ month: 'Jun', revenue: 314 },
];

export const defaultImports = `import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { barY, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';`;

export const defaultSkeleton = `@defer {
  <tanstack-chart hlmChart [options]="_chartOptions" />
} @placeholder {
  <div class="aspect-video w-full" aria-hidden="true"></div>
}`;

@Component({
	selector: 'spartan-chart-preview',
	imports: [HlmChartImports],
	host: { class: 'block w-full max-w-3xl' },
	template: `
		@defer {
			<tanstack-chart hlmChart [options]="_chartOptions" />
		} @placeholder {
			<div class="aspect-video w-full" aria-hidden="true"></div>
		}
	`,
})
export class ChartPreview {
	protected readonly _chartOptions = {
		definition: defineChart(
			{
				marks: [barY(revenue, { x: 'month', y: 'revenue', inset: 4, fill: 'var(--chart-1)' })],
				x: { scale: () => scaleBand<string>().padding(0.16) },
				y: {
					scale: scaleLinear,
					nice: true,
					grid: true,
					axis: { label: 'Revenue' },
				},
				theme: HLM_CHART_THEME,
			},
			{
				focus: 'nearest-x',
				tooltip: hlmChartTooltip(),
			},
		),
		ariaLabel: 'Monthly revenue',
		ariaDescription: 'Bar chart showing revenue from January through June.',
		aspectRatio: 16 / 9,
	};
}
