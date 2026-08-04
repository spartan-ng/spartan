import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAxisModule,
	VisCrosshairModule,
	VisScatterModule,
	VisTooltipModule,
	VisXYContainerModule,
} from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

type ScatterDatum = { month: string; desktop: number; mobile: number };

const chartData: ScatterDatum[] = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
];

const monthLabels = chartData.map((d) => d.month.slice(0, 3));

@Component({
	selector: 'spartan-chart-scatter-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisScatterModule,
		VisXYContainerModule,
		VisAxisModule,
		VisCrosshairModule,
		VisTooltipModule,
	],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Scatter Chart</h3>
				<p hlmCardDescription>Desktop vs Mobile by month</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 36, right: 8 }">
							<vis-scatter [x]="xAccessor" [y]="yAccessors" [color]="colorAccessor" [size]="sizeAccessor" />
							<vis-axis
								type="x"
								position="bottom"
								[tickFormat]="tickFormat"
								[gridLine]="false"
								[tickLine]="false"
								[domainLine]="false"
							/>
							<vis-axis type="y" position="left" [gridLine]="true" [tickLine]="false" [domainLine]="false" />
							<vis-crosshair [template]="crosshairTemplate" />
							<vis-tooltip />
						</vis-xy-container>
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
export class ChartScatterPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<ScatterDatum> = (_d, i) => i;
	public readonly yAccessors: NumericAccessor<ScatterDatum>[] = [(d) => d.desktop, (d) => d.mobile];
	public readonly colorAccessor = (_d: ScatterDatum, i: number) => (i === 0 ? 'var(--chart-1)' : 'var(--chart-2)');
	public readonly sizeAccessor = () => 12;
	public readonly tickFormat = (_: number | Date, i: number) => monthLabels[i] ?? '';

	public readonly crosshairTemplate = (d: ScatterDatum) => {
		const items = [
			{ name: 'Desktop', value: d.desktop, color: 'var(--chart-1)' },
			{ name: 'Mobile', value: d.mobile, color: 'var(--chart-2)' },
		];
		const itemHtml = items
			.map(
				(item) => `
					<div class="flex w-full items-stretch gap-2 items-center">
						<div class="h-2.5 w-2.5 shrink-0 rounded-xs" style="background:${item.color}"></div>
						<div class="flex flex-1 justify-between leading-none items-center">
							<span class="text-muted-foreground">${item.name}</span>
							<span class="text-foreground font-mono font-medium tabular-nums ml-4">${item.value.toLocaleString()}</span>
						</div>
					</div>
				`,
			)
			.join('');
		return `
			<div class="border-border/50 bg-background grid min-w-32 items-start rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
				<div class="grid gap-1.5">${itemHtml}</div>
			</div>
		`;
	};

	public readonly chartConfig = {
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	} satisfies ChartConfig;
}
