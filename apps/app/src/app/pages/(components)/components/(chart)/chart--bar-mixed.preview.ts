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

type BarDatum = { browser: string; visitors: number };

const chartData: BarDatum[] = [
	{ browser: 'Chrome', visitors: 275 },
	{ browser: 'Safari', visitors: 200 },
	{ browser: 'Firefox', visitors: 187 },
	{ browser: 'Edge', visitors: 173 },
	{ browser: 'Other', visitors: 90 },
];

@Component({
	selector: 'spartan-chart-bar-mixed-preview',
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
				<h3 hlmCardTitle>Bar Chart - Mixed</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 72, right: 8 }">
							<vis-grouped-bar
								[x]="xAccessor"
								[y]="yAccessor"
								[color]="colorAccessor"
								[roundedCorners]="4"
								[orientation]="'horizontal'"
							/>
							<vis-axis type="x" position="bottom" [gridLine]="true" [tickLine]="false" [domainLine]="false" />
							<vis-axis
								type="y"
								position="left"
								[tickFormat]="yTickFormat"
								[gridLine]="false"
								[tickLine]="false"
								[domainLine]="false"
							/>
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
export class ChartBarMixedPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<BarDatum> = (d: BarDatum) => d.visitors;
	public readonly yAccessor: NumericAccessor<BarDatum> = (_d: BarDatum, i: number) => i;
	public readonly colorAccessor = (_d: BarDatum, i: number) => 'var(--chart-' + (i + 1) + ')';
	public readonly yTickFormat = (_: number | Date, i: number) => chartData[i]?.browser ?? '';

	public readonly crosshairTemplate = (d: BarDatum) => {
		const items = [{ name: d.browser, value: d.visitors, color: 'var(--chart-1)' }];
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
		chrome: { label: 'Chrome', color: 'var(--chart-1)' },
		safari: { label: 'Safari', color: 'var(--chart-2)' },
		firefox: { label: 'Firefox', color: 'var(--chart-3)' },
		edge: { label: 'Edge', color: 'var(--chart-4)' },
		other: { label: 'Other', color: 'var(--chart-5)' },
	} satisfies ChartConfig;
}
