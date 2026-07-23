import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports, resolveCssVar } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

@Component({
	selector: 'spartan-chart-radar-multiple-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="flex w-full flex-col">
			<hlm-card-header class="items-center pb-4">
				<h3 hlmCardTitle>Radar Chart - Multiple</h3>
				<p hlmCardDescription>Showing total visitors for the last 6 months</p>
			</hlm-card-header>
			<hlm-card-content class="flex-1 pb-0">
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig" class="mx-auto aspect-square max-h-[250px]">
						<div echarts [options]="chartOptions" class="h-full w-full"></div>
					</hlm-chart-container>
				}
			</hlm-card-content>
			<hlm-card-footer class="flex-col gap-2">
				<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
				<div class="text-muted-foreground leading-none">January - June 2024</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartRadarMultiplePreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies ChartConfig;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: {
			trigger: 'item',
			backgroundColor: 'var(--background)',
			borderColor: 'var(--border)',
			borderWidth: 1,
			textStyle: { color: 'var(--foreground)', fontSize: 12 },
			extraCssText: 'box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); border-radius: 0.5rem;',
		},
		legend: {
			show: true,
			textStyle: { color: 'var(--muted-foreground)', fontSize: 12 },
		},
		radar: {
			indicator: [
				{ name: 'January', max: 350 },
				{ name: 'February', max: 350 },
				{ name: 'March', max: 350 },
				{ name: 'April', max: 350 },
				{ name: 'May', max: 350 },
				{ name: 'June', max: 350 },
			],
			axisName: { color: resolveCssVar('--muted-foreground'), fontSize: 12 },
			splitLine: { lineStyle: { color: resolveCssVar('--border') } },
			splitArea: { areaStyle: { color: [resolveCssVar('--muted'), 'transparent'] } },
		},
		series: [
			{
				name: 'Desktop',
				type: 'radar',
				data: [{ value: chartData.map((d) => d.desktop), name: 'Desktop' }],
				symbol: 'none',
				lineStyle: { color: resolveCssVar('--chart-1'), width: 2 },
				itemStyle: { color: resolveCssVar('--chart-1') },
				areaStyle: { color: resolveCssVar('--chart-1'), opacity: 0.2 },
			},
			{
				name: 'Mobile',
				type: 'radar',
				data: [{ value: chartData.map((d) => d.mobile), name: 'Mobile' }],
				symbol: 'none',
				lineStyle: { color: resolveCssVar('--chart-2'), width: 2 },
				itemStyle: { color: resolveCssVar('--chart-2') },
				areaStyle: { color: resolveCssVar('--chart-2'), opacity: 0.2 },
			},
		],
	};
}
