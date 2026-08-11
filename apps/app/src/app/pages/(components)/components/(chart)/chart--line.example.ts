import { Component } from '@angular/core';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';

const downloads = [
	{ month: 'Jan', downloads: 42 },
	{ month: 'Feb', downloads: 58 },
	{ month: 'Mar', downloads: 51 },
	{ month: 'Apr', downloads: 73 },
	{ month: 'May', downloads: 81 },
	{ month: 'Jun', downloads: 96 },
];

@Component({
	selector: 'spartan-chart-line',
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
export class ChartLine {
	protected readonly _chartOptions = {
		definition: defineChart(
			{
				marks: [
					lineY(downloads, {
						x: 'month',
						y: 'downloads',
						points: true,
						stroke: 'var(--chart-2)',
						strokeWidth: 2.5,
					}),
				],
				x: { scale: () => scalePoint<string>().padding(0.2) },
				y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Downloads (thousands)' } },
				theme: HLM_CHART_THEME,
			},
			{ focus: 'nearest-x', tooltip: hlmChartTooltip() },
		),
		ariaLabel: 'Monthly downloads',
		ariaDescription: 'Line chart showing downloads from January through June.',
		aspectRatio: 16 / 9,
	};
}
