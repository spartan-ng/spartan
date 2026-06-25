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
import type { NumericAccessor } from '@unovis/ts';

type LineDatum = { month: string; desktop: number };

const chartData: LineDatum[] = [
	{ month: 'January', desktop: 186 },
	{ month: 'February', desktop: 305 },
	{ month: 'March', desktop: 237 },
	{ month: 'April', desktop: 73 },
	{ month: 'May', desktop: 209 },
	{ month: 'June', desktop: 214 },
];

const monthLabels = chartData.map((d) => d.month.slice(0, 3));

@Component({
	selector: 'spartan-chart-line-dots-preview',
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
				<h3 hlmCardTitle>Line Chart - Dots</h3>
				<p hlmCardDescription>January - June 2024</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container [data]="data" [margin]="{ top: 8, bottom: 20, left: 36, right: 8 }">
							<vis-line [x]="xAccessor" [y]="yAccessor" [color]="colorAccessor" [lineWidth]="2" />
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
export class ChartLineDotsPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<LineDatum> = (_d: LineDatum, i: number) => i;
	public readonly yAccessor: NumericAccessor<LineDatum> = (d: LineDatum) => d.desktop;
	public readonly colorAccessor = () => 'var(--chart-1)';
	public readonly tickFormat = (_: number | Date, i: number) => monthLabels[i] ?? '';

	public readonly crosshairTemplate = (d: LineDatum) => {
		const items = [{ name: 'Desktop', value: d.desktop, color: 'var(--chart-1)' }];
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
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	} satisfies ChartConfig;
}
