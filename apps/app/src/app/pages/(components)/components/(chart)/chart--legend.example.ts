import { Component } from '@angular/core';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { colorLegend, defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';

const visitors = [
	{ month: 'Jan', channel: 'Desktop', visitors: 186 },
	{ month: 'Feb', channel: 'Desktop', visitors: 305 },
	{ month: 'Mar', channel: 'Desktop', visitors: 237 },
	{ month: 'Apr', channel: 'Desktop', visitors: 273 },
	{ month: 'Jan', channel: 'Mobile', visitors: 80 },
	{ month: 'Feb', channel: 'Mobile', visitors: 200 },
	{ month: 'Mar', channel: 'Mobile', visitors: 120 },
	{ month: 'Apr', channel: 'Mobile', visitors: 190 },
];

@Component({
	selector: 'spartan-chart-legend',
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
export class ChartLegend {
	protected readonly _chartOptions = {
		definition: defineChart(
			{
				marks: [lineY(visitors, { x: 'month', y: 'visitors', z: 'channel', points: true, strokeWidth: 2.5 })],
				scales: {
					x: { scale: () => scalePoint<string>().padding(0.2) },
					y: { scale: scaleLinear, nice: true, grid: true, axis: { label: 'Visitors' } },
				},
				color: {
					domain: ['Desktop', 'Mobile'],
					legend: colorLegend({ label: 'Device' }),
				},
				theme: HLM_CHART_THEME,
			},
			{ focus: 'group-x', tooltip: hlmChartTooltip() },
		),
		ariaLabel: 'Visitors by device',
		ariaDescription: 'Line chart comparing desktop and mobile visitors from January through April.',
		aspectRatio: 16 / 9,
	};
}
