import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const barChartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

@Component({
	selector: 'spartan-chart-bar-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Bar Chart - Multiple</h3>
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
export class ChartBarPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies ChartConfig;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: { trigger: 'axis' },
		legend: { show: false },
		grid: { left: 0, right: 0, bottom: 0, top: 8, containLabel: true },
		xAxis: {
			type: 'category',
			data: barChartData.map((d) => d.month.slice(0, 3)),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { fontSize: 12 },
		},
		yAxis: {
			type: 'value',
			splitLine: { lineStyle: { color: 'var(--border)' } },
			axisLine: { show: false },
			axisTick: { show: false },
		},
		series: [
			{
				name: 'desktop',
				type: 'bar',
				data: barChartData.map((d) => d.desktop),
				itemStyle: { color: 'var(--color-desktop)', borderRadius: [4, 4, 0, 0] },
			},
			{
				name: 'mobile',
				type: 'bar',
				data: barChartData.map((d) => d.mobile),
				itemStyle: { color: 'var(--color-mobile)', borderRadius: [4, 4, 0, 0] },
			},
		],
	};
}
