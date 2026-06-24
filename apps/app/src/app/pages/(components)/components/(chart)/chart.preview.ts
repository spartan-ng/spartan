import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
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
		desktop: { label: 'Desktop', color: '#2563eb' },
	} satisfies ChartConfig;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: { trigger: 'axis' },
		grid: { left: 0, right: 0, bottom: 0, top: 8, containLabel: true },
		xAxis: {
			type: 'category',
			data: chartData.map((d) => d.month.slice(0, 3)),
			axisLine: { show: false },
			axisTick: { show: false },
		},
		yAxis: {
			type: 'value',
			splitLine: { show: false },
			axisLine: { show: false },
			axisTick: { show: false },
		},
		series: [
			{
				type: 'bar',
				data: chartData.map((d) => d.desktop),
				itemStyle: { color: 'var(--color-desktop)', borderRadius: [4, 4, 0, 0] },
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
<hlm-chart-container [config]="chartConfig">
  <div echarts [options]="chartOptions" class="h-full w-full"></div>
</hlm-chart-container>
`;
