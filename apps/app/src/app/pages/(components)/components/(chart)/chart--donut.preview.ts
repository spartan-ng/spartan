import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { addChartEmphasis, HlmChartImports, resolveCssVar } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
	selector: 'spartan-chart-donut-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="flex w-full flex-col">
			<hlm-card-header class="items-center pb-0">
				<h3 hlmCardTitle>Pie Chart - Donut with Text</h3>
				<p hlmCardDescription>January - June 2024</p>
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
				<div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartDonutPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' },
	} satisfies ChartConfig;

	private readonly _total = 925;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: {
			trigger: 'item',
			backgroundColor: 'var(--background)',
			borderColor: 'var(--border)',
			borderWidth: 1,
			textStyle: { color: 'var(--foreground)', fontSize: 12 },
			extraCssText: 'box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); border-radius: 0.5rem;',
		},
		legend: { show: false },
		series: [
			addChartEmphasis({
				name: 'Visitors',
				type: 'pie',
				radius: ['45%', '75%'],
				avoidLabelOverlap: false,
				itemStyle: { borderRadius: 4, borderColor: 'transparent', borderWidth: 2 },
				label: { show: false },
				emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
				labelLine: { show: false },
				data: [
					{ value: 275, name: 'chrome', itemStyle: { color: resolveCssVar('--chart-1') } },
					{ value: 200, name: 'safari', itemStyle: { color: resolveCssVar('--chart-2') } },
					{ value: 187, name: 'firefox', itemStyle: { color: resolveCssVar('--chart-3') } },
					{ value: 173, name: 'edge', itemStyle: { color: resolveCssVar('--chart-4') } },
					{ value: 90, name: 'other', itemStyle: { color: resolveCssVar('--chart-5') } },
				],
			}),
		],
		graphic: {
			type: 'text',
			left: 'center',
			top: 'center',
			style: {
				text: `${this._total.toLocaleString()}`,
				fontSize: 24,
				fontWeight: 700,
				fill: 'currentColor',
			},
		},
	};
}
