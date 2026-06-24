import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { addChartEmphasis, HlmChartImports, resolveCssVar } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const chartData = [
	{ browser: 'Chrome', visitors: 275 },
	{ browser: 'Safari', visitors: 200 },
	{ browser: 'Firefox', visitors: 187 },
	{ browser: 'Edge', visitors: 173 },
	{ browser: 'Other', visitors: 90 },
];

@Component({
	selector: 'spartan-chart-bar-mixed-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Bar Chart - Mixed</h3>
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
export class ChartBarMixedPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		visitors: { label: 'Visitors' },
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' },
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
			type: 'value',
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
			axisLine: { show: false },
			axisTick: { show: false },
			splitLine: { lineStyle: { color: resolveCssVar('--border') } },
		},
		yAxis: {
			type: 'category',
			data: chartData.map((d) => d.browser),
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
			axisLine: { show: false },
			axisTick: { show: false },
		},
		series: [
			addChartEmphasis({
				name: 'visitors',
				type: 'bar',
				data: [
					{ value: chartData[0].visitors, itemStyle: { color: resolveCssVar('--chart-1') } },
					{ value: chartData[1].visitors, itemStyle: { color: resolveCssVar('--chart-2') } },
					{ value: chartData[2].visitors, itemStyle: { color: resolveCssVar('--chart-3') } },
					{ value: chartData[3].visitors, itemStyle: { color: resolveCssVar('--chart-4') } },
					{ value: chartData[4].visitors, itemStyle: { color: resolveCssVar('--chart-5') } },
				],
				itemStyle: { borderRadius: [0, 4, 4, 0] },
			}),
		],
	};
}
