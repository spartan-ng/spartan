import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAxisModule,
	VisCrosshairModule,
	VisGroupedBarModule,
	VisTooltipModule,
	VisXYContainerModule,
} from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

type BarDatum = { month: string; visitors: number };

const chartData: BarDatum[] = [
	{ month: 'January', visitors: 186 },
	{ month: 'February', visitors: 205 },
	{ month: 'March', visitors: -207 },
	{ month: 'April', visitors: 173 },
	{ month: 'May', visitors: -209 },
	{ month: 'June', visitors: 214 },
];

const monthLabels = chartData.map((d) => d.month.slice(0, 3));

@Component({
	selector: 'spartan-chart-bar-negative-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisGroupedBarModule,
		VisXYContainerModule,
		VisAxisModule,
		VisCrosshairModule,
		VisTooltipModule,
	],
	host: { class: 'w-full max-w-md' },
	template: `
		<hlm-card class="w-full">
			<hlm-card-header>
				<h3 hlmCardTitle>Bar Chart - Negative</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 36, right: 8 }">
							<vis-grouped-bar [x]="xAccessor" [y]="yAccessor" [color]="colorAccessor" [roundedCorners]="4" />
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
export class ChartBarNegativePreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<BarDatum> = (_d: BarDatum, i: number) => i;
	public readonly yAccessor: NumericAccessor<BarDatum> = (d: BarDatum) => d.visitors;
	public readonly colorAccessor = (d: BarDatum) => (d.visitors > 0 ? 'var(--chart-1)' : 'var(--chart-2)');
	public readonly tickFormat = (_: number | Date, i: number) => monthLabels[i] ?? '';

	public readonly crosshairTemplate = (d: BarDatum) => {
		const items = [
			{ name: 'Visitors', value: d.visitors, color: d.visitors > 0 ? 'var(--chart-1)' : 'var(--chart-2)' },
		];
		const itemHtml = items
			.map(
				(item) => `
					<div class="flex w-full items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground items-center">
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
		visitors: { label: 'Visitors' },
	} satisfies ChartConfig;
}
