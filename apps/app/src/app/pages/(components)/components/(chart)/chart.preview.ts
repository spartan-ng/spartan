import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports, resolveCssVar } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const chartData = [
	{ month: 'January', desktop: 186 },
	{ month: 'February', desktop: 305 },
	{ month: 'March', desktop: 237 },
	{ month: 'April', desktop: 73 },
	{ month: 'May', desktop: 209 },
	{ month: 'June', desktop: 214 },
];

@Component({
	selector: 'spartan-chart-preview',
	imports: [HlmChartImports, NgxEchartsDirective],
	host: { class: 'block' },
	template: `
		@if (isBrowser) {
			<hlm-chart-container [config]="chartConfig" class="min-h-[200px] w-full">
				<div echarts [options]="chartOptions" class="h-full w-full"></div>
			</hlm-chart-container>
		}
	`,
})
export class ChartPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
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
		grid: { left: 0, right: 0, bottom: 0, top: 8, containLabel: true },
		xAxis: {
			type: 'category',
			data: chartData.map((d) => d.month.slice(0, 3)),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
		},
		yAxis: {
			type: 'value',
			splitLine: { show: false },
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
		},
		series: [
			{
				type: 'bar',
				data: chartData.map((d) => d.desktop),
				itemStyle: { color: resolveCssVar('--chart-1'), borderRadius: [4, 4, 0, 0] },
			},
		],
	};
}

export const defaultImports = `
import { HlmChartImports } from '@spartan-ng/helm/chart';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts';
`;

export const defaultSkeleton = `
<hlm-chart-container [config]="chartConfig" class="min-h-[200px] w-full">
  <div echarts [options]="chartOptions" class="h-full w-full"></div>
</hlm-chart-container>
`;
