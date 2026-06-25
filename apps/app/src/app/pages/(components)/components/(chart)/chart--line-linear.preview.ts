import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAxisModule,
	VisCrosshairModule,
	VisLineModule,
	VisTooltipModule,
	VisXYContainerModule,
} from '@unovis/angular';
import { CurveType, type NumericAccessor } from '@unovis/ts';

type LinearDatum = { date: Date; desktop: number };

const chartData: LinearDatum[] = [
	{ date: new Date('2024-01-01'), desktop: 186 },
	{ date: new Date('2024-02-01'), desktop: 305 },
	{ date: new Date('2024-03-01'), desktop: 237 },
	{ date: new Date('2024-04-01'), desktop: 73 },
	{ date: new Date('2024-05-01'), desktop: 209 },
	{ date: new Date('2024-06-01'), desktop: 214 },
];

const monthLabels = chartData.map((d) => d.date.toLocaleDateString('en-US', { month: 'short' }));

@Component({
	selector: 'spartan-chart-line-linear-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisLineModule,
		VisXYContainerModule,
		VisAxisModule,
		VisCrosshairModule,
		VisTooltipModule,
	],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Line Chart - Linear</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container
							[data]="data"
							[margin]="{ top: 8, bottom: 20, left: 36, right: 8 }"
							[yDomain]="[0, undefined]"
						>
							<vis-line
								[x]="xAccessor"
								[y]="yAccessor"
								[color]="colorAccessor"
								[curveType]="curveType"
								[lineWidth]="2"
							/>
							<vis-axis
								type="x"
								position="bottom"
								[tickFormat]="tickFormat"
								[tickValues]="tickValues"
								[gridLine]="false"
								[tickLine]="false"
								[domainLine]="false"
							/>
							<vis-axis
								type="y"
								position="left"
								[numTicks]="3"
								[gridLine]="true"
								[tickLine]="false"
								[domainLine]="false"
							/>
							<vis-crosshair [template]="crosshairTemplate" [color]="'var(--chart-1)'" />
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
export class ChartLineLinearPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly curveType = CurveType.Linear;
	public readonly xAccessor: NumericAccessor<LinearDatum> = (d) => d.date.getTime();
	public readonly yAccessor: NumericAccessor<LinearDatum> = (d) => d.desktop;
	public readonly colorAccessor = () => 'var(--chart-1)';
	public readonly tickValues = chartData.map((d) => d.date.getTime());
	public readonly tickFormat = (_: number | Date, i: number) => monthLabels[i] ?? '';

	public readonly crosshairTemplate = (d: LinearDatum) => {
		const items = [{ name: 'Desktop', value: d.desktop, color: 'var(--chart-1)' }];
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
	} satisfies ChartConfig;
}
