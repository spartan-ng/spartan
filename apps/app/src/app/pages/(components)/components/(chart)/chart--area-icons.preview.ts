import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { ChartConfig } from '@spartan-ng/helm/chart';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import {
	VisAreaModule,
	VisAxisModule,
	VisCrosshairModule,
	VisLineModule,
	VisTooltipModule,
	VisXYContainerModule,
} from '@unovis/angular';
import type { NumericAccessor } from '@unovis/ts';

type AreaIconDatum = { month: number; monthLabel: string; desktop: number; mobile: number };

const chartData: AreaIconDatum[] = [
	{ month: 1, monthLabel: 'January', desktop: 186, mobile: 80 },
	{ month: 2, monthLabel: 'February', desktop: 305, mobile: 200 },
	{ month: 3, monthLabel: 'March', desktop: 237, mobile: 120 },
	{ month: 4, monthLabel: 'April', desktop: 73, mobile: 190 },
	{ month: 5, monthLabel: 'May', desktop: 209, mobile: 130 },
	{ month: 6, monthLabel: 'June', desktop: 214, mobile: 140 },
];

@Component({
	selector: 'spartan-chart-area-icons-preview',
	imports: [
		HlmCardImports,
		HlmChartImports,
		VisAreaModule,
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
				<h3 hlmCardTitle>Area Chart - Icons</h3>
				<p hlmCardDescription>Showing total visitors for the last 6 months</p>
			</hlm-card-header>
			<hlm-card-content>
				@if (isBrowser) {
					<hlm-chart-container [config]="chartConfig">
						<vis-xy-container [data]="data" [margin]="{ top: 10, bottom: 10 }">
							<vis-area [x]="xAccessor" [y]="yAccessors" [color]="colorAccessor" [opacity]="0.4" />
							<vis-line [x]="xAccessor" [y]="yAccessors" [color]="colorAccessor" [lineWidth]="1" />
							<vis-axis
								type="x"
								position="bottom"
								[tickFormat]="tickFormat"
								[gridLine]="false"
								[tickLine]="false"
								[domainLine]="false"
								[numTicks]="6"
							/>
							<vis-axis
								type="y"
								position="left"
								[numTicks]="3"
								[tickLine]="false"
								[domainLine]="false"
								[tickFormat]="emptyFormat"
							/>
							<vis-crosshair [template]="crosshairTemplate" [color]="crosshairColor" />
							<vis-tooltip />
						</vis-xy-container>
					</hlm-chart-container>
				}
			</hlm-card-content>
			<hlm-card-footer>
				<div class="flex w-full items-start gap-2">
					<div class="grid gap-2">
						<div class="flex items-center gap-2 leading-none font-medium">Trending up by 5.2% this month</div>
						<div class="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>
					</div>
				</div>
			</hlm-card-footer>
		</hlm-card>
	`,
})
export class ChartAreaIconsPreview {
	public readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
	public readonly data = chartData;
	public readonly xAccessor: NumericAccessor<AreaIconDatum> = (d) => d.month;
	public readonly yAccessors: NumericAccessor<AreaIconDatum>[] = [(d) => d.mobile, (d) => d.desktop];
	public readonly colorAccessor = (_d: unknown, i: number): string => (i === 0 ? 'var(--chart-2)' : 'var(--chart-1)');
	public readonly crosshairColor = (_d: unknown, i: number): string =>
		i % 2 === 0 ? 'var(--chart-2)' : 'var(--chart-1)';
	public readonly emptyFormat = () => '';
	public readonly tickFormat = (_: number | Date, i: number) => chartData[i]?.monthLabel.slice(0, 3) ?? '';

	public readonly crosshairTemplate = (d: AreaIconDatum) => {
		const items = [
			{ name: 'Mobile', value: d.mobile, color: 'var(--chart-2)' },
			{ name: 'Desktop', value: d.desktop, color: 'var(--chart-1)' },
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
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
		desktop: { label: 'Desktop', color: 'var(--chart-1)' },
	} satisfies ChartConfig;
}
