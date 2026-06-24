import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { addChartEmphasis, HlmChartImports, resolveCssVar } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const chartData = [
	{ month: 'January', visitors: 186 },
	{ month: 'February', visitors: 205 },
	{ month: 'March', visitors: -207 },
	{ month: 'April', visitors: 173 },
	{ month: 'May', visitors: -209 },
	{ month: 'June', visitors: 214 },
];

@Component({
	selector: 'spartan-chart-bar-negative-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Bar Chart - Negative</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<div echarts [options]="chartOptions" class="h-full w-full"></div>
					</hlm-chart-container>
				}
			</hlm-card-content>
			<hlm-card-footer class="flex-col items-start gap-2">
				<div class="flex gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
				<div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartBarNegativePreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		visitors: { label: 'Visitors' },
	} satisfies ChartConfig;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'var(--background)',
			borderColor: 'var(--border)',
			borderWidth: 1,
			textStyle: { color: 'var(--foreground)', fontSize: 12 },
			extraCssText: 'box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); border-radius: 0.5rem;',
		},
		legend: { show: false },
		grid: { left: 0, right: 0, bottom: 0, top: 8, containLabel: true },
		xAxis: {
			type: 'category',
			data: chartData.map((d) => d.month.slice(0, 3)),
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
			axisLine: { show: false },
			axisTick: { show: false },
		},
		yAxis: {
			type: 'value',
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
			axisLine: { show: false },
			axisTick: { show: false },
			splitLine: { lineStyle: { color: resolveCssVar('--border') } },
		},
		series: [
			addChartEmphasis({
				name: 'visitors',
				type: 'bar',
				data: chartData.map((d) => ({
					value: d.visitors,
					itemStyle: {
						color: d.visitors > 0 ? resolveCssVar('--chart-1') : resolveCssVar('--chart-2'),
						borderRadius: [4, 4, 0, 0],
					},
				})),
				label: {
					show: true,
					position: 'top',
					color: resolveCssVar('--muted-foreground'),
					fontSize: 12,
					formatter: (params: { name: string }) => params.name,
				},
			}),
		],
	};
}
