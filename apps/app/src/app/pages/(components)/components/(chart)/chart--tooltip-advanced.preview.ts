import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import type { EChartsCoreOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

const chartData = [
	{ date: '2024-07-15', running: 450, swimming: 300 },
	{ date: '2024-07-16', running: 380, swimming: 420 },
	{ date: '2024-07-17', running: 520, swimming: 120 },
	{ date: '2024-07-18', running: 140, swimming: 550 },
	{ date: '2024-07-19', running: 600, swimming: 350 },
	{ date: '2024-07-20', running: 480, swimming: 400 },
];

@Component({
	selector: 'spartan-chart-tooltip-advanced-preview',
	imports: [HlmCardImports, HlmChartImports, NgxEchartsDirective],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Tooltip - Advanced</h3>
				<p hlmCardDescription>Tooltip with custom formatter and total</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<div echarts [options]="chartOptions" class="h-full w-full"></div>
					</hlm-chart-container>
				}
			</hlm-card-content>
		</hlm-card>
	`,
})
export class ChartTooltipAdvancedPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	public readonly chartConfig = {
		running: { label: 'Running', color: 'var(--chart-1)' },
		swimming: { label: 'Swimming', color: 'var(--chart-2)' },
	} satisfies ChartConfig;

	public readonly chartOptions: EChartsCoreOption = {
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'var(--background)',
			borderColor: 'var(--border)',
			borderWidth: 1,
			textStyle: { color: 'var(--foreground)', fontSize: 12 },
			extraCssText: 'box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1); border-radius: 0.5rem;',
			formatter: (params: Array<{ seriesName: string; value: number; color: string }>) => {
				if (!Array.isArray(params)) return '';
				const total = params.reduce((sum, p) => sum + p.value, 0);
				const items = params
					.map(
						(p) => `
					<div style="display:flex;align-items:center;gap:8px;padding:2px 0">
						<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
						<span style="color:var(--muted-foreground);flex:1">${p.seriesName}</span>
						<span style="font-family:monospace;font-weight:500;color:var(--foreground);tabular-nums">${p.value.toLocaleString()} kcal</span>
					</div>`,
					)
					.join('');
				return `
					<div style="min-width:180px">
						${items}
						<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);display:flex;align-items:center;gap:8px">
							<span style="font-weight:500;color:var(--foreground)">Total</span>
							<span style="margin-left:auto;font-family:monospace;font-weight:500;color:var(--foreground);tabular-nums">${total.toLocaleString()} kcal</span>
						</div>
					</div>`;
			},
		},
		legend: { show: false },
		grid: { left: 0, right: 0, bottom: 0, top: 8, containLabel: true },
		xAxis: {
			type: 'category',
			data: chartData.map((d) => {
				const date = new Date(d.date);
				return date.toLocaleDateString('en-US', { weekday: 'short' });
			}),
			axisLabel: { color: 'var(--muted-foreground)', fontSize: 12 },
			axisLine: { show: false },
			axisTick: { show: false },
		},
		yAxis: {
			type: 'value',
			axisLabel: { color: 'var(--muted-foreground)', fontSize: 12 },
			axisLine: { show: false },
			axisTick: { show: false },
			splitLine: { lineStyle: { color: 'var(--border)' } },
		},
		series: [
			{
				name: 'Running',
				type: 'bar',
				stack: 'total',
				data: chartData.map((d) => d.running),
				itemStyle: { color: 'var(--color-running)', borderRadius: [0, 0, 4, 4] },
			},
			{
				name: 'Swimming',
				type: 'bar',
				stack: 'total',
				data: chartData.map((d) => d.swimming),
				itemStyle: { color: 'var(--color-swimming)', borderRadius: [4, 4, 0, 0] },
			},
		],
	};
}
