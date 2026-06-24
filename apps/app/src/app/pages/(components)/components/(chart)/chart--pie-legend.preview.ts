import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
	selector: 'spartan-chart-pie-legend-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="flex w-full flex-col">
			<hlm-card-header class="items-center pb-0">
				<h3 hlmCardTitle>Pie Chart - Legend</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content class="flex-1 pb-0">
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig" class="mx-auto aspect-square max-h-[300px]">
						<div echarts [options]="chartOptions" class="h-full w-full"></div>
					</hlm-chart-container>
				}
			</hlm-card-content>
		</hlm-card>
	`,
})
export class ChartPieLegendPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' },
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
			bottom: 0,
			left: 'center',
		},
		series: [
			{
				name: 'Visitors',
				type: 'pie',
				radius: ['0%', '70%'],
				center: ['50%', '40%'],
				avoidLabelOverlap: false,
				itemStyle: { borderRadius: 4, borderColor: 'transparent', borderWidth: 2 },
				label: { show: false },
				emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
				data: [
					{ value: 275, name: 'chrome', itemStyle: { color: 'var(--color-chrome)' } },
					{ value: 200, name: 'safari', itemStyle: { color: 'var(--color-safari)' } },
					{ value: 187, name: 'firefox', itemStyle: { color: 'var(--color-firefox)' } },
					{ value: 173, name: 'edge', itemStyle: { color: 'var(--color-edge)' } },
					{ value: 90, name: 'other', itemStyle: { color: 'var(--color-other)' } },
				],
			},
		],
	};
}
