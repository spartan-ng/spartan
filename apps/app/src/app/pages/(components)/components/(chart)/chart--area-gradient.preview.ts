import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports, resolveCssVar } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const areaChartData = [
	{ month: 'January', desktop: 186 },
	{ month: 'February', desktop: 305 },
	{ month: 'March', desktop: 237 },
	{ month: 'April', desktop: 73 },
	{ month: 'May', desktop: 209 },
	{ month: 'June', desktop: 214 },
];

@Component({
	selector: 'spartan-chart-area-gradient-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Area Chart - Gradient</h3>
				<p hlmCardDescription>Showing total visitors for the last 6 months</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<div echarts [options]="chartOptions" class="h-full w-full"></div>
					</hlm-chart-container>
				}
			</hlm-card-content>
			<hlm-card-footer>
				<div class="flex w-full items-start gap-2">
					<div class="grid gap-2">
						<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
						<div class="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>
					</div>
				</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartAreaGradientPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	} satisfies ChartConfig;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'none' },
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
			data: areaChartData.map((d) => d.month.slice(0, 3)),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
			boundaryGap: false,
		},
		yAxis: {
			type: 'value',
			splitLine: { lineStyle: { color: resolveCssVar('--border') } },
			axisLine: { show: false },
			axisTick: { show: false },
		},
		series: [
			{
				name: 'desktop',
				type: 'line',
				data: areaChartData.map((d) => d.desktop),
				smooth: true,
				lineStyle: { color: resolveCssVar('--chart-1'), width: 2 },
				itemStyle: { color: resolveCssVar('--chart-1') },
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: resolveCssVar('--chart-1') },
							{ offset: 1, color: resolveCssVar('--chart-2') },
						],
					},
					opacity: 0.4,
				},
			},
		],
	};
}
